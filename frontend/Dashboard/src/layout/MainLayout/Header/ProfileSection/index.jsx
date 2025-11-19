import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import UpgradePlanCard from './UpgradePlanCard';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import User1 from 'assets/images/users/user-round.svg';
import FaceIcon from '@mui/icons-material/face';
import { IconLogout, IconSearch, IconSettings, IconUser, IconLogin } from '@tabler/icons-react';

// api
import api from 'api/api.js';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const {
    state: { borderRadius }
  } = useConfig();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [open, setOpen] = useState(false);

  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // pas connecté

      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Erreur récupération profil :', err.response?.data || err.message);
        localStorage.removeItem('token');
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigate('/pages/login'); // redirection vers login
  };

  return (
    <>
      <Chip
        slotProps={{ label: { sx: { lineHeight: 0 } } }}
        sx={{ ml: 2, height: '48px', alignItems: 'center', borderRadius: '27px' }}
        icon={
          <Avatar
            sx={{
              typography: 'mediumAvatar',
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
              bgcolor: 'warning.main' // couleur de fond
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          >
            <FaceIcon />
          </Avatar>
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      {user ? (
                        <>
                          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="h4">Good Morning,</Typography>
                            <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                              {user.fullName}
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle2">{user.roleName}</Typography>
                        </>
                      ) : (
                        <Typography variant="h6">Welcome</Typography>
                      )}

                      <Divider />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >

                      <Divider />
                      <List>
                        {user ? (
                          <>
                            <ListItemButton>
                              <ListItemIcon><IconSettings stroke={1.5} size="20px" /></ListItemIcon>
                              <ListItemText primary="Account Settings" />
                            </ListItemButton>
                            <ListItemButton>
                              <ListItemIcon><IconUser stroke={1.5} size="20px" /></ListItemIcon>
                              <ListItemText primary="Social Profile" />
                            </ListItemButton>
                            <ListItemButton onClick={handleLogout}>
                              <ListItemIcon><IconLogout stroke={1.5} size="20px" /></ListItemIcon>
                              <ListItemText primary="Logout" />
                            </ListItemButton>
                          </>
                        ) : (
                          <ListItemButton onClick={() => navigate('/pages/login')}>
                            <ListItemIcon><IconLogin stroke={1.5} size="20px" /></ListItemIcon>
                            <ListItemText primary="Login" />
                          </ListItemButton>
                        )}
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
