import React from 'react';
import { AuthContext } from 'contexts/AuthenticationContext';

// material-ui
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import api from '../../api/api';

// Fonction magique pour générer une couleur unique par exercice
function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

export default function MySeance() {
    const [loading, setLoading] = React.useState(true);
    const { user } = React.useContext(AuthContext);
    const [exercicesData, setExercicesData] = React.useState([]);

    // État pour gérer le zoom sur un exercice
    const [selectedExercice, setSelectedExercice] = React.useState(null);

    const fetchallByDateDesc = async () => {
        try {
            const data = await api.allByDateDesc();
            setExercicesData(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des séances :', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (user) {
            fetchallByDateDesc();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress size={50} thickness={4} />
            </Box>
        );
    }

    if (!user) {
        return (
            <MainCard title="Mes Exercices">
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Veuillez vous connecter pour voir vos exercices.
                </Typography>
            </MainCard>
        );
    }

    if (exercicesData.length === 0) {
        return (
            <MainCard title="Mes Exercices">
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Aucun exercice trouvé.
                </Typography>
            </MainCard>
        );
    }

    return (
        <MainCard title="Mes Exercices">
            {/* Grille responsive de cartes */}
            <Grid container spacing={3}>
                {exercicesData.map((exercice) => {
                  

                    return (
                        <Grid item xs={12} sm={6} md={4} key={exercice.id}>
                            <Card
                                elevation={2}
                                onClick={() => setSelectedExercice(exercice)} // Ouvre la modale au clic
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                bgcolor: stringToColor(exercice.exerciceTypeName),
                                                boxShadow: '0 0 8px ' + stringToColor(exercice.exerciceTypeName) // Léger effet néon sympa
                                            }}
                                        />
                                    }
                                    title={exercice.exerciceTypeName}
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600, noWrap: true }}
                                    subheader={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <CalendarTodayIcon fontSize="caption" color="action" />
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(exercice.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ pb: 1.5 }}
                                />

                                <Divider variant="middle" />

                                <CardContent sx={{ pt: 2, flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                        <Chip label={`${exercice.sets} séries`} size="small" variant="outlined" color="info" />
                                        <Chip label={`${exercice.repetitions} reps`} size="small" variant="outlined" color="secondary" />
                                        <Chip label={`${exercice.weight} kg`} size="small" color="primary" fontWeight="bold" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* ============================== BOÎTE DE DIALOGUE (ZOOM) ============================== */}
            <Dialog
                open={Boolean(selectedExercice)}
                onClose={() => setSelectedExercice(null)}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                {selectedExercice && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: stringToColor(selectedExercice.exerciceTypeName), width: 48, height: 48, fontWeight: 'bold' }}>
                                    {selectedExercice.exerciceTypeName.substring(0, 2).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" fontWeight="700">{selectedExercice.exerciceTypeName}</Typography>
                                    <Typography variant="body2" color="text.secondary">Détails de la performance</Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={() => setSelectedExercice(null)} sx={{ position: 'absolute', right: 16, top: 16, color: 'grey.500' }}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <Divider />

                        <DialogContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                                    <Typography fontWeight="600">Date de la séance</Typography>
                                    <Typography color="text.secondary">{new Date(selectedExercice.date).toLocaleDateString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                                    <Typography fontWeight="600">Séries réalisées</Typography>
                                    <Chip label={`${selectedExercice.sets} séries`} color="info" size="small" sx={{ color: '#ffffff' }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                                    <Typography fontWeight="600">Répétitions par série</Typography>
                                    <Chip label={`${selectedExercice.repetitions} reps`} color="secondary" size="small" />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                                    <Typography fontWeight="600">Charge</Typography>
                                    <Chip label={`${selectedExercice.weight} kg`} color="primary" size="small" />
                                </Box>
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ px: 2, pb: 1 }}>
                            <Button onClick={() => setSelectedExercice(null)} variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                                OK, Super !
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </MainCard>
    );
}