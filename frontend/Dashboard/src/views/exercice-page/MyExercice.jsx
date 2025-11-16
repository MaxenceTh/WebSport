import React from 'react';
import { AuthContext } from 'contexts/AuthenticationContext';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';


// api
import api from '../../api/api';

export default function MySeance({ }) {


    const [loading, setLoading] = React.useState(true);
    const { user } = React.useContext(AuthContext);
    const [exercicesData, setExercicesData] = React.useState([]);

    const fetchallByDateDesc = async () => {
        try {
            const data = await api.allByDateDesc();
            setExercicesData(data);
            console.log('Données des séances récupérées :', data);
        } catch (error) {
            console.error('Erreur lors de la récupération des séances :', error);
        }
    };

    React.useEffect(() => {
        if (user) {
            setLoading(false);
            fetchallByDateDesc();
            return;
        } else {
            setLoading(false);
        }
        
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <MainCard title="My Exercices">
                <Typography variant="body1">Veuillez vous connecter pour voir vos exercices.</Typography>
            </MainCard>
        );
    }

    if (exercicesData.length === 0) {
        return (
            <MainCard title="My Exercices">
                <Typography variant="body1">Aucun exercice trouvée.</Typography>
            </MainCard>
        );
    }

    return (

        <MainCard title="Mes Exercices">
            {exercicesData.map((exercice) => (
                <Box key={exercice.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                    <Typography variant="h6">Exercice: {exercice.exerciceTypeName}</Typography>
                    <Typography variant="body1">Date: {new Date(exercice.date).toLocaleDateString()}</Typography>
                    <Typography variant="body1">Répétitions: {exercice.repetitions}</Typography>
                    <Typography variant="body1">Sets: {exercice.sets}</Typography>
                    <Typography variant="body1">Poids: {exercice.weight} kg</Typography>
                </Box>
            ))}
        </MainCard>
    );
}
