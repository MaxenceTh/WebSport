import PropTypes from 'prop-types';
import React, { useState, useContext, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// third party
import Chart from 'react-apexcharts';

// project imports
import chartOptions from './chart-data/max-weight-line-chart';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { AuthContext } from 'contexts/AuthenticationContext';
import api from '../../../api/api';
import { set } from 'lodash-es';

// data
const monthlyData = [{ data: [45, 66, 41, 89, 25, 44, 9, 54] }];
const yearlyData = [{ data: [35, 44, 9, 54, 45, 66, 41, 69] }];

export default function MaxWeightLineChartCard({ isLoading }) {
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const [exerciceValue, setExerciceValue] = useState("Traction");
  const [maxExercice, setMaxExercice] = useState(null);
  const [maxExerciceDate, setMaxExerciceDate] = useState(null);
  const [series, setSeries] = useState();
  const [exerciceNames, setExerciceNames] = useState([]);

  const limitedSeries = series
    ? [
      {
        name: 'Max Weight',
        data: series[0].data.slice(-100)
      }
    ]
    : [];

  // fonction pour récupérer le max weight depuis l'API
  const fetchMaxExercice = async (exerciseName) => {
    try {
      if (!user) return;
      const response = await api.getMaxExerciceWeight(exerciseName);
      setMaxExercice(response.weight);
      setMaxExerciceDate(response.date);
    } catch (err) {
      console.error('Erreur récupération séance :', err.response?.data || err.message);
    }
  };

  const fetchGetExerciceNames = async () => {
    try {
      if (!user) return;
      const response = await api.getExerciceNames();
      setExerciceNames(response);
    } catch (err) {
      console.error('Erreur récupération noms des exercices :', err.response?.data || err.message);
    }
  };

  const fetchWeightByTime = async (exerciseName) => {
    try {
      if (!user) return;
      const response = await api.weightByTime(exerciseName);
      const weights = response.map(entry => entry.weight);
      setSeries([{ data: weights }]);
    } catch (err) {
      console.error('Erreur récupération poids au fil du temps :', err.response?.data || err.message);
    }
  };

  // appel initial et à chaque changement d'exercice ou utilisateur
  useEffect(() => {
    fetchGetExerciceNames();
    fetchMaxExercice(exerciceValue);
    fetchWeightByTime(exerciceValue);
  }, [user, exerciceValue]);

  const handleChangeExercice = (event) => {
    setExerciceValue(event.target.value);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&>div': { position: 'relative', zIndex: 5 },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.vars.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.largeAvatar,
                  borderRadius: 2,
                  bgcolor: 'primary.800',
                  color: 'common.white',
                  mt: 1
                }}
              >
                <FitnessCenterIcon fontSize="inherit" />

              </Avatar>

              {/* Select Exercice */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: theme.palette.primary.dark },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.light }
                  },
                  '& .MuiSelect-select': { color: theme.palette.common.white },
                  '& .MuiSvgIcon-root': { color: theme.palette.common.white }
                }}
              >
                <Select
                  value={exerciceValue}
                  onChange={handleChangeExercice}
                  label="Exercice"
                  sx={{ fontSize: '1rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}
                >
                  {exerciceNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Grid sx={{ mb: 0.75 }}>
              <Grid container sx={{ alignItems: 'center' }}>
                <Grid size={6}>
                  <Box>
                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                        {maxExercice ?? '-'}
                      </Typography>
                      <Avatar sx={{ ...theme.typography.smallAvatar, bgcolor: 'primary.200', color: 'primary.dark' }}>
                        <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 50deg)' }} />
                      </Avatar>
                    </Stack>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'primary.200' }}>
                      Date : {maxExerciceDate ?? '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={6} sx={{ '.apexcharts-tooltip.apexcharts-theme-light': { color: theme.vars.palette.text.primary, background: theme.vars.palette.background.default } }}>
                  {series && series.length > 0 && (
                    <Chart options={chartOptions} series={limitedSeries} type="line" height={90} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

MaxWeightLineChartCard.propTypes = { isLoading: PropTypes.bool };
