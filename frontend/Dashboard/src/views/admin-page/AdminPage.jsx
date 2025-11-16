import { Typography, IconButton } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import api from '../../api/api';
import { useEffect, useState } from 'react';

export default function AdminPage() {
    const [allUsers, setAllUsers] = useState([]);
    const [userSeancesMap, setUserSeancesMap] = useState({}); // { userId: [seances] }
    const [openedUsers, setOpenedUsers] = useState({}); // { userId: true/false }

    // Récupérer tous les utilisateurs
    const fetchAllUsers = async () => {
        try {
            const response = await api.getAllUsers();
            setAllUsers(response);
            console.log("Utilisateurs récupérés :", response);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    // Récupérer les séances d'un utilisateur
    const fetchUserSeances = async (userId) => {
        try {
            const response = await api.oneSeancesForAdmin(userId);
            setUserSeancesMap(prev => ({ ...prev, [userId]: response }));
            setOpenedUsers(prev => ({ ...prev, [userId]: true }));
            console.log(`Séances de l'utilisateur #${userId} :`, response);
        } catch (error) {
            console.error(`Erreur lors de la récupération des séances de l'utilisateur #${userId} :`, error);
        }
    };

    // Toggle l'affichage des séances
    const toggleSeances = (userId) => {
        setOpenedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
        if (!userSeancesMap[userId]) {
            fetchUserSeances(userId);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <MainCard title="Admin Page">
            <Typography variant="body1">Welcome on the administrator's page</Typography>
            <Typography sx={{ mt: 2 }}>All Users:</Typography>

            {allUsers.map((user) => (
                <SubCard key={user.id} title={`${user.fullName}`} darkTitle sx={{ mb: 2 }}>
                    <Typography variant="body2">Email: {user.email}</Typography>
                    <Typography variant="body2">Role: {user.roleName}</Typography>

                    <Typography variant="body2">
                        Watch Workouts
                        <IconButton onClick={() => toggleSeances(user.id)}>
                            {openedUsers[user.id] ? <IconEyeOff /> : <IconEye />}
                        </IconButton>
                    </Typography>

                    {openedUsers[user.id] && userSeancesMap[user.id]?.length > 0 && (
                        <div>
                            <Typography sx={{ mt: 2 }}>Seances:</Typography>
                            {userSeancesMap[user.id].map((seance) => (
                                <SubCard
                                    key={seance.id}
                                    title={`${seance.name}`}
                                    darkTitle
                                    sx={{ mb: 1 }}
                                >
                                    {seance.exercices.length > 0 ? (
                                        seance.exercices.map((ex) => (
                                            <Typography key={ex.id} variant="body2" sx={{ ml: 2 }}>
                                                - {ex.name}: {ex.weight} kg x {ex.repetitions} reps
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2" sx={{ ml: 2 }}>
                                            No exercises in this seance.
                                        </Typography>
                                    )}
                                </SubCard>
                            ))}
                        </div>
                    )}
                </SubCard>
            ))}
        </MainCard>
    );
}
