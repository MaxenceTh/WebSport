import { useContext } from 'react';
import { IconKey, IconLogin, IconLogout, IconUser } from '@tabler/icons-react';
import { AuthContext } from '../contexts/AuthenticationContext';


const icons = {
  IconKey,
  IconLogin,
  IconLogout,
  IconUser
};


export default function usePagesMenu() {
  const { user, logout } = useContext(AuthContext);

  return {
    id: 'pages',
    title: 'Pages',
    icon: icons.IconKey,
    type: 'group',
    children: user
      ? [
          {
            id: 'logout',
            title: 'Logout',
            type: 'item',
            icon: icons.IconLogout,
            url: '#',
            onClick: logout // Appelle ta fonction logout()
          }
        ]
      : [
          {
            id: 'login',
            title: 'Login',
            type: 'item',
            icon: icons.IconLogin,
            url: '/pages/login',
            target: true
          }
        ]
  };
}
