import { IconShieldCheck } from '@tabler/icons-react';


const icons = { IconShieldCheck };

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
    }
  ]
};

export default admin;
