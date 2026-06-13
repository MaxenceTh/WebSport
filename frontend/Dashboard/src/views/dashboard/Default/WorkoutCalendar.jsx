import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

// third party - FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import { AuthContext } from 'contexts/AuthenticationContext';
import api from '../../../api/api';

export default function WorkoutCalendar({ isLoading }) {
    const theme = useTheme();
    const { user } = useContext(AuthContext);

    // // Liste des séances affichées sur le calendrier
    const [events, setEvents] = useState([]);

    const [allSeances, setAllSeances] = useState([]);
    const [apiLoading, setApiLoading] = useState(true);

    // États pour gérer la modale de création
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateStr, setSelectedDateStr] = useState('');
    const [workoutName, setWorkoutName] = useState('');
    const [selectedSeance, setSelectedSeance] = useState(null);

    useEffect(() => {
        const fetchUserSeances = async () => {
            if (!user) {
                setApiLoading(false);
                return;
            }
            try {
                const seances = await api.getAllSeances();
                setAllSeances(seances);
                console.log('Après filtre:', seances.filter(s => s.date));
                const calendarEvents = seances
                    .filter((seance) => seance.date)
                    .map((seance) => ({
                        id: String(seance.id),
                        title: seance.name,
                        date: seance.date,
                        color: theme.palette.primary.main
                    }));

                setEvents(calendarEvents);

            } catch (err) {
                console.error('Erreur récupération titre séance :', err.response?.data || err.message);
                localStorage.removeItem('token');
            } finally {
                setApiLoading(false);
            }
        };
        fetchUserSeances();
    }, [user]);

    // 1. Déclenché quand on clique sur une case du calendrier
    const handleDateClick = (arg) => {
        setSelectedDateStr(arg.dateStr);
        console.log('Date sélectionnée :', arg.dateStr);
        setWorkoutName('');
        setIsModalOpen(true);
    };

    // 2. Déclenché quand on valide le formulaire de la modale
    const handleAddWorkout = async () => {
        if (!selectedSeance) return;

        try {
            await api.updateDateSeance(
                selectedSeance.id,
                selectedDateStr
            );

            const newEvent = {
                id: String(selectedSeance.id),
                title: selectedSeance.name,
                date: selectedDateStr,
                color: theme.palette.primary.main
            };

            setEvents((prev) => [...prev, newEvent]);

            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    // Gestion de l'affichage du Skeleton global de la page
    if (isLoading || apiLoading) {
        return <SkeletonTotalGrowthBarChart />;
    }

    return (
        <>
            <MainCard>
                <Stack sx={{ gap: gridSpacing }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack sx={{ gap: 1 }}>
                            <Typography variant="subtitle2">Mon Plan d'Entraînement</Typography>
                            <Typography variant="h3">Planning de la semaine</Typography>
                        </Stack>
                    </Stack>

                    {/* Zone Calendrier */}
                    <Box
                        sx={{
                            height: 480,
                            '& .fc': { height: '100%', fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary },
                            '& .fc-theme-standard td, & .fc-theme-standard th': { borderColor: theme.palette.divider },
                            '& .fc-col-header-cell': { bgcolor: theme.palette.action.hover, py: 1 },
                            '& .fc-daygrid-day:hover': { bgcolor: theme.palette.action.hover, cursor: 'pointer' },
                            '& .fc-event': {
                                borderRadius: '6px', padding: '2px 4px', minHeight: '40px', display: 'flex', justifyContent: 'center',
                                alignItems: 'center', fontWeight: 500, border: 'none', fontSize: '0.75rem', margin: '4px 0', textAlign: 'center',
                            },
                            '& .fc-toolbar': { mb: '10px !important' },
                            '& .fc-event-title': {
                                whiteSpace: 'normal',
                                wordBreak: 'break-word'
                            },
                        }}
                    >
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridWeek"
                            locale="fr"
                            firstDay={1}
                            headerToolbar={{ left: 'prev,next', center: 'title', right: '' }}
                            events={events}
                            dateClick={handleDateClick}
                            height="100%"
                        />
                    </Box>
                </Stack>
            </MainCard >

            {/* ============================== MODALE : AJOUTER UNE SÉANCE ============================== */}
            < Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)
                }
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AddCircleOutlineIcon color="primary" fontSize="large" />
                    <Box>
                        <Typography variant="h4" fontWeight="700">Nouvelle séance</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Pour le : {selectedDateStr && new Date(selectedDateStr).toLocaleDateString('fr-FR')}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setIsModalOpen(false)}
                        sx={{ position: 'absolute', right: 16, top: 16, color: 'grey.500' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, pt: 1 }}>
                    <Autocomplete
                        options={allSeances}
                        getOptionLabel={(option) => option.name || ''}
                        value={selectedSeance}
                        onChange={(event, newValue) => {
                            setSelectedSeance(newValue);
                            setWorkoutName(newValue?.name || '');
                            console.log('Séance sélectionnée :', newValue);
                            console.log('ID :', newValue?.id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                autoFocus
                                margin="dense"
                                label="Sélectionner une séance"
                                variant="outlined"
                                placeholder="Cliquez pour voir vos séances..."
                                sx={{ mt: 1 }}
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsModalOpen(false)} color="inherit" variant="text">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleAddWorkout}
                        variant="contained"
                        color="primary"
                        disabled={!workoutName.trim()}
                        sx={{ borderRadius: 2 }}
                    >
                        Ajouter au planning
                    </Button>
                </DialogActions>
            </Dialog >
        </>
    );
}

WorkoutCalendar.propTypes = { isLoading: PropTypes.bool };