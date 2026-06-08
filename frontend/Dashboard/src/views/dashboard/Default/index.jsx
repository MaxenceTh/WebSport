import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import MaxWeightLineChartCard from './MaxWeightLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalVolumeBarChart';
// 1. IMPORT DE TON NOUVEAU COMPOSANT CALENDRIER
import WorkoutCalendar from './WorkoutCalendar'; 

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// api
import api from '../../../api/api';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  const [weightForYear, setWeightForYear] = useState(0);
  const [weightForMonth, setWeightForMonth] = useState(0);

  const fetchtotalWeightForYear = async () => {
    try {
      const year = new Date().getFullYear();
      const totalWeight = await api.totalWeightForYear(year);
      setWeightForYear(totalWeight.toLocaleString('fr-FR'));
      console.log('Total Weight for Year:', totalWeight);
    } catch (error) {
      console.error('Error fetching total weight for year:', error);
    }
  };

  const fetchtotalWeightForMonth = async () => {
    try {
      const date = new Date();  
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const totalWeight = await api.totalWeightForMonth(month, year);
      setWeightForMonth(totalWeight.toLocaleString('fr-FR'));
      console.log('Total Weight for Month:', totalWeight);
    } catch (error) {
      console.error('Error fetching total weight for month:', error);
    }
  };

  useEffect(() => {
    // Il est préférable de passer le loading à false APRÈS les requêtes API
    const loadData = async () => {
      await Promise.all([fetchtotalWeightForYear(), fetchtotalWeightForMonth()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      {/* --- LIGNE 1 : LES PETITES CARTES DE STATS --- */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <MaxWeightLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeDarkCard
                  {... {
                    isLoading: isLoading,
                    total: weightForYear,
                    label: 'Total weight by year',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" /> 
                  }} 
                />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: weightForMonth,
                    label: 'Total weight by month',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* --- LIGNE 2 : LE DUO GRAPHIQUE + CALENDRIER (MÊME TAILLE) --- */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          {/* Le graphique prend désormais la moitié de l'écran sur PC (md: 6) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          
          {/* Ton nouveau calendrier prend l'autre moitié (md: 6) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <WorkoutCalendar isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      {/* --- LIGNE 3 : LES AUTRES COMPOSANTS (Ex: PopularCard) --- */}
      {/* <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
}