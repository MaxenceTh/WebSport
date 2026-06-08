// material-ui
import { useEffect, useState, useContext } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

// Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import api from '../../api/api';
import { AuthContext } from 'contexts/AuthenticationContext';


export default function MySeance() {
    const [allSeances, setAllSeances] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    
    // État pour stocker la séance sélectionnée (pour le zoom)
    const [selectedSeance, setSelectedSeance] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const seances = await api.getAllSeances();
                setAllSeances(seances);
            } catch (err) {
                console.error('Erreur récupération séance :', err.response?.data || err.message);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [user]);

    const handleDeleteSeance = async (id, e) => {
        // e.stopPropagation() évite d'ouvrir la modale quand on clique sur le bouton supprimer
        e.stopPropagation(); 
        
        if (!window.confirm(`Supprimer la séance #${id} ?`)) return;
        try {
            await api.deleteSeance(id);
            setAllSeances((prev) => prev.filter((s) => s.id !== id));
            // Si la séance supprimée était ouverte, on ferme la modale
            if (selectedSeance?.id === id) setSelectedSeance(null);
        } catch (err) {
            console.error('Erreur suppression séance :', err.response?.data || err.message);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress size={50} thickness={4} />
            </Box>
        );
    }

    if (!user) {
        return (
            <MainCard title="Mes Séances">
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Veuillez vous connecter pour voir vos séances.
                </Typography>
            </MainCard>
        );
    }

    if (allSeances.length === 0) {
        return (
            <MainCard title="Mes Séances">
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Aucune séance trouvée. Commencez à vous entraîner !
                </Typography>
            </MainCard>
        );
    }

    return (
        <MainCard title="Mes Séances">
            <Grid container spacing={3}>
                {allSeances.map((seance) => (
                    <Grid item xs={12} sm={6} md={4} key={seance.id}>
                        <Card 
                            elevation={2} 
                            onClick={() => setSelectedSeance(seance)} // au clic, on sélectionne la séance
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                borderRadius: 2,
                                cursor: 'pointer', // Curseur main pour indiquer que c'est cliquable
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardHeader
                                avatar={<FitnessCenterIcon color="primary" />}
                                title={seance.name}
                                titleTypographyProps={{ variant: 'h4', fontWeight: 600 }}
                                subheader={`ID: ${seance.id}`}
                                action={
                                    <IconButton 
                                        color="error" 
                                        onClick={(e) => handleDeleteSeance(seance.id, e)} // 'e' transmis ici
                                        sx={{ '&:hover': { backgroundColor: 'error.lighter' } }}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                }
                                sx={{ pb: 1 }}
                            />
                            <Divider variant="middle" />
                            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                {seance.exercices && seance.exercices.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        {/* On n'affiche que les 2 premiers exos sur la carte pour ne pas surcharger */}
                                        {seance.exercices.slice(0, 3).map((ex) => (
                                            <Typography key={ex.id} variant="body2" noWrap>
                                               - {ex.exerciceTypeName}
                                            </Typography>
                                        ))}
                                        {seance.exercices.length > 2 && (
                                            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                                                + {seance.exercices.length - 2} autre(s) exercice(s)...
                                            </Typography>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        Aucun exercice.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ============================== MODALE PLEIN ÉCRAN (ZOOM) ============================== */}
            <Dialog 
                open={Boolean(selectedSeance)} 
                onClose={() => setSelectedSeance(null)}
                fullWidth
                maxWidth="sm" // Largeur max de la boîte (ajustable : xs, sm, md, lg)
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                {selectedSeance && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <FitnessCenterIcon color="primary" fontSize="large" />
                                <Box>
                                    <Typography variant="h3" fontWeight="700">{selectedSeance.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">ID: {selectedSeance.id}</Typography>
                                </Box>
                            </Box>
                            <IconButton
                                onClick={() => setSelectedSeance(null)}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    top: 16,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        
                        <Divider />
                        
                        <DialogContent sx={{ p: 3 }}>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                Liste des Exercices ({selectedSeance.exercices?.length || 0})
                            </Typography>
                            
                            {selectedSeance.exercices && selectedSeance.exercices.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {selectedSeance.exercices.map((ex) => (
                                        <Box 
                                            key={ex.id} 
                                            sx={{ 
                                                backgroundColor: 'action.hover', 
                                                p: 2, 
                                                borderRadius: 2,
                                                borderLeft: '4px solid',
                                                borderColor: 'primary.main'
                                            }}
                                        >
                                            <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                                                {ex.exerciceTypeName}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip label={`${ex.sets} séries`} color="info" variant="outlined" />
                                                <Chip label={`${ex.repetitions} répétitions`} color="secondary" variant="outlined" />
                                                <Chip label={`${ex.weight} kg`} color="primary" />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 3 }}>
                                    Aucun exercice enregistré dans cette séance.
                                </Typography>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button 
                                onClick={() => setSelectedSeance(null)} 
                                variant="contained" 
                                color="primary"
                                fullWidth
                                sx={{ borderRadius: 2 }}
                            >
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </MainCard>
    );
}