import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// api
import api from '../../../api/api';


export default function PopularCard({ isLoading }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    fetchallByDateDesc();
  }, []);

  const handleClickViewAll = () => {
    navigate('/my-exercice');
  }

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Stack sx={{ gap: gridSpacing }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">Last recent exercices</Typography>
                {/* <IconButton size="small" sx={{ mt: -0.625 }}>
                  <MoreHorizOutlinedIcon
                    fontSize="small"
                    sx={{ cursor: 'pointer' }}
                    aria-controls="menu-popular-card"
                    aria-haspopup="true"
                    onClick={handleClick}
                  />
                </IconButton> */}
              </Stack>
              <Menu
                id="menu-popular-card"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleClose}> Today</MenuItem>
                <MenuItem onClick={handleClose}> This Month</MenuItem>
                <MenuItem onClick={handleClose}> This Year </MenuItem>
              </Menu>

              {/* <BajajAreaChartCard /> */}
              {exercicesData.slice(0, 5).map((exercice, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}></Stack>

                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                      {exercice.exerciceTypeName}
                    </Typography>
                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                        {exercice.weight} kg
                      </Typography>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '5px',
                          bgcolor: 'success.light',
                          color: 'success.dark',
                          ml: 2
                        }}
                      >
                        <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                      </Avatar>
                    </Stack>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ color: '' }}>
                    {exercice.sets} reps x {exercice.repetitions} sets
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                </Box>

              ))}






            </Stack>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation onClick={handleClickViewAll}>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

PopularCard.propTypes = { isLoading: PropTypes.bool };
