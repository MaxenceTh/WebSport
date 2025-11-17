import { IconShieldCheck, IconHelp } from '@tabler/icons-react';


const icons = { IconShieldCheck, IconHelp };

const admin = {
  id: 'admin-section',
  title: 'Administration',
  type: 'group',
  children: [
    {
      id: 'admin-only',
      title: 'Gestion Admin',
      type: 'item',
      url: '/admin-only',
      icon: icons.IconShieldCheck,
      breadcrumbs: false
    },
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/berry/',
      icon: icons.IconHelp,
      external: true,
      target: true
    }
  ]
};

export default admin;
