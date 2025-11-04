// material-ui
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Close';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import api from '../../api/api';

// ==============================|| SAMPLE PAGE ||============================== //

export default function MySeance() {
    const [allSeances, setAllSeances] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    // Récupération des séances
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);

            if (!token) {
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
    }, []);

    // Suppression d’une séance
    const handleDeleteSeance = async (id) => {
        if (!window.confirm(`Supprimer la séance #${id} ?`)) return;

        try {
            await api.deleteSeance(id);
            setAllSeances((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error('Erreur suppression séance :', err.response?.data || err.message);
        }
    };

    // Chargement
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Non connecté
    if (!isAuthenticated) {
        return (
            <MainCard title="My Seances">
                <Typography variant="body1">Veuillez vous connecter pour voir vos séances.</Typography>
            </MainCard>
        );
    }

    // Aucune séance
    if (allSeances.length === 0) {
        return (
            <MainCard title="My Seances">
                <Typography variant="body1">Aucune séance trouvée.</Typography>
            </MainCard>
        );
    }
    return (
        <MainCard title="Mes Séances">
            {allSeances.map((seance) => (
                <SubCard
                    key={seance.id}
                    title={`${seance.name} (ID: ${seance.id})`}
                    darkTitle
                    secondary={
                        <IconButton color="error" onClick={() => handleDeleteSeance(seance.id)}>
                            <DeleteIcon />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {seance.exercices && seance.exercices.length > 0 ? (
                        seance.exercices.map((ex) => (
                            <Typography key={ex.id} variant="body2" sx={{ ml: 2 }}>
                                • {ex.exerciceTypeName} — {ex.sets} séries × {ex.repetitions} reps — {ex.weight} kg
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" sx={{ ml: 2 }}>
                            Aucun exercice dans cette séance.
                        </Typography>
                    )}
                </SubCard>
            ))}
        </MainCard>
    );
}
