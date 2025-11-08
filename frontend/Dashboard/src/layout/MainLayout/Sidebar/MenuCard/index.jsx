import PropTypes from 'prop-types';
import { memo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';


// icons
import { IconLogin, IconLogout } from '@tabler/icons-react';

// context
import { AuthContext } from 'contexts/AuthenticationContext';




// ==============================|| SIDEBAR - MENU CARD ||============================== //

function MenuCard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = () => {
    if (user) {
      // logout
      logout();
      // navigate('/pages/login');
      window.location.reload();
    } else {
      // login
      navigate('/pages/login');
    }
  };


  return (

    <List>
      <ListItemButton key={user ? 'logout' : 'login'} onClick={handleClick}>
        <ListItemIcon>
          {user ? <IconLogout stroke={1.5} size="20px" /> : <IconLogin stroke={1.5} size="20px" />}
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="body2">{user ? 'Logout' : 'Login'}</Typography>}
        />
      </ListItemButton>
    </List>

  );
}

export default memo(MenuCard);

// LinearProgressWithLabel.propTypes = { value: PropTypes.number, others: PropTypes.any };
