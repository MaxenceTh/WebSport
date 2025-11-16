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
    setLoading(false);
    fetchtotalWeightForYear();
    fetchtotalWeightForMonth();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
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
                  }} />
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
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
