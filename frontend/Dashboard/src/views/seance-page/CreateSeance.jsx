import { useContext, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import MainCard from 'ui-component/cards/MainCard';
import api from '../../api/api';
import { AuthContext } from 'contexts/AuthenticationContext';



export default function CreateSeance() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [exercices, setExercices] = useState([
    { exerciceTypeName: '', sets: '', repetitions: '', weight: '', restTime: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Ajouter un exercice vide
  const addExercice = () => {
    setExercices([
      ...exercices,
      { exerciceTypeName: '', sets: '', repetitions: '', weight: '', restTime: '' }
    ]);
  };

  // Supprimer un exercice
  const removeExercice = (index) => {
    const updated = exercices.filter((_, i) => i !== index);
    setExercices(updated);
  };

  // Modifier un champ d'exercice
  const handleExerciceChange = (index, field, value) => {
    const updated = [...exercices];
    updated[index][field] = value;
    setExercices(updated);
  };

  // Envoi à l’API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const seance = { name, exercices };
      await api.createSeance(seance);
      setMessage('✅ Séance créée avec succès !');
      setName('');
      setExercices([{ exerciceTypeName: '', sets: '', repetitions: '', weight: '', restTime: '' }]);
    } catch (err) {
      console.error('Erreur création séance :', err.response?.data || err.message);
      setMessage('❌ Erreur lors de la création de la séance.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <MainCard title="Créer une séance">
        <Typography variant="body1">
          Vous devez être connecté pour créer une séance.
        </Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title="Créer une séance">
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Nom de la séance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Exercices
        </Typography>

        {exercices.map((ex, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom de l'exercice"
                  value={ex.exerciceTypeName}
                  onChange={(e) => handleExerciceChange(index, 'exerciceTypeName', e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="Séries"
                  type="number"
                  value={ex.sets}
                  onChange={(e) => handleExerciceChange(index, 'sets', e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="Répétitions"
                  type="number"
                  value={ex.repetitions}
                  onChange={(e) => handleExerciceChange(index, 'repetitions', e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="Poids (kg)"
                  type="number"
                  value={ex.weight}
                  onChange={(e) => handleExerciceChange(index, 'weight', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="Repos (sec)"
                  type="number"
                  value={ex.restTime}
                  onChange={(e) => handleExerciceChange(index, 'restTime', e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>

            {exercices.length > 1 && (
              <IconButton
                color="error"
                onClick={() => removeExercice(index)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Paper>
        ))}

        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={addExercice}
          sx={{ mb: 2 }}
        >
          Ajouter un exercice
        </Button>

        <Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer la séance'}
          </Button>
        </Box>

        {message && (
          <Typography
            variant="body1"
            color={message.includes('✅') ? 'success.main' : 'error.main'}
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </form>
    </MainCard>
  );
}
