import { Typography, IconButton, Pagination } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import api from '../../api/api';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


export default function AdminPage() {
    const [allUsers, setAllUsers] = useState([]);
    const [userSeancesMap, setUserSeancesMap] = useState({}); // { userId: [seances] }
    const [openedUsers, setOpenedUsers] = useState({}); // { userId: true/false }
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2; // Nombre d'utilisateurs par page


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
        // Si true = on ferme, si false on ouvre
        setOpenedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
        // Si les séances ne sont pas encore chargées, on les charge
        if (!userSeancesMap[userId]) {
            fetchUserSeances(userId);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    // Calculer les données paginées
    const totalPages = Math.ceil(allUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + itemsPerPage);

    // Gérer le changement de page
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <MainCard title="Admin Page">
            <Typography variant="body1">Welcome on the administrator's page</Typography>

            <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                <Grid item>
                    <Button variant="contained" color="primary">
                        Add user
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary">
                        Delete user
                    </Button>
                </Grid>
            </Grid>
            <Typography sx={{ mb: 2, fontSize: '0.9rem', color: 'text.secondary' }}>
                Affichage {startIndex + 1} à {Math.min(startIndex + itemsPerPage, allUsers.length)} sur {allUsers.length} utilisateurs
            </Typography>

            {paginatedUsers.map((user) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
                <Grid container justifyContent="center" sx={{ mt: 4 }}>
                    <Pagination 
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Grid>
            )}
        </MainCard>
    );
}
