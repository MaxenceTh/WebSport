import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import barChartOptions from './chart-data/total-growth-bar-chart';

// api
import api from '../../../api/api';


const status = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

const series = [
  { name: 'Investment', data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75] },
  { name: 'Loss', data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75] },
  { name: 'Profit', data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10] },
  { name: 'Maintenance', data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0] }
];

export default function TotalGrowthBarChart({ isLoading }) {
  const theme = useTheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const [value, setValue] = useState('today');
  const [chartOptions, setChartOptions] = useState(barChartOptions);

  const textPrimary = theme.vars.palette.text.primary;
  const divider = theme.vars.palette.divider;
  const grey500 = theme.vars.palette.grey[500];

  const primary200 = theme.vars.palette.primary[200];
  const primaryDark = theme.vars.palette.primary.dark;
  const secondaryMain = theme.vars.palette.secondary.main;
  const secondaryLight = theme.vars.palette.secondary.light;

  const exercices = ['Fentes', 'Traction', 'Squat'];

  const [repetitionsData, setRepetitionsData] = useState([
    { name: 'Fentes', data: Array(12).fill(0) },
    { name: 'Traction', data: Array(12).fill(0) },
    { name: 'Squat', data: Array(12).fill(0) }
  ]);

  const [totalRepetitionsMonth, setTotalRepetitionsMonth] = useState(0);


  const fetchtotalRepetitionsForMonthByName = async (startDate, endDate, exerciceName) => {
    try {
      const response = await api.totalRepetitionsForMonthByName(exerciceName, startDate, endDate);
      setTotalRepetitionsMonth((prevTotal) => prevTotal + (response || 0));
      console.log(`Total répétitions pour le mois ${exerciceName}:`, response);
      console.log("startDate:", startDate, "endDate:", endDate);
      const monthIndex = new Date(startDate).getMonth();
      setRepetitionsData((prevData) =>
        prevData.map((item) =>
          item.name === exerciceName
            ? { ...item, data: item.data.map((val, idx) => (idx === monthIndex ? response || 0 : val)) }
            : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la récupération du total des répétitions pour le mois", error);
    }
  }

  useEffect(() => {

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };


    setTotalRepetitionsMonth(0);

    exercices.forEach((exercice) => {
      fetchtotalRepetitionsForMonthByName(formatDate(firstDayOfMonth), formatDate(lastDayOfMonth), exercice);
    });


    setChartOptions({
      ...barChartOptions,
      chart: { ...barChartOptions.chart, fontFamily: fontFamily },
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: { ...barChartOptions.xaxis, labels: { style: { colors: textPrimary } } },
      yaxis: { ...barChartOptions.yaxis, labels: { style: { colors: textPrimary } } },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { ...(barChartOptions.legend ?? {}), labels: { ...(barChartOptions.legend?.labels ?? {}), colors: grey500 } }
    });
  }, [fontFamily, primary200, primaryDark, secondaryMain, secondaryLight, textPrimary, grey500, divider]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Stack sx={{ gap: gridSpacing }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack sx={{ gap: 1 }}>
                <Typography variant="subtitle2">Volume of year by each months</Typography>
                <Typography variant="h3">{totalRepetitionsMonth} reps this year</Typography>
              </Stack>
              <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Box
              sx={{
                ...theme.applyStyles('light', {
                  '& .apexcharts-series:nth-of-type(4) path:hover': {
                    filter: `brightness(0.95)`,
                    transition: 'all 0.3s ease'
                  }
                })
              }}
            >
              <Chart options={chartOptions} series={repetitionsData} type="bar" height={480} />
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

TotalGrowthBarChart.propTypes = { isLoading: PropTypes.bool };
