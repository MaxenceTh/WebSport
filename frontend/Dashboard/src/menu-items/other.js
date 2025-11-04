// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'seance-pages',
  title: 'Seance',
  type: 'group',
  children: [
     {
      id: 'my-seances',
      title: 'My Seances',
      type: 'item',
      url: '/my-seance',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'create-seance',
      title: 'Create Seance',
      type: 'item',
      url: '/create-seance',
      icon: icons.IconBrandChrome,
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

export default other;
