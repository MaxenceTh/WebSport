// assets
import { IconBrandChrome, IconHelp, IconBarbell, IconFilePlus } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp, IconBarbell, IconFilePlus };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const seance = {
  id: 'seance-pages',
  title: 'Seance',
  type: 'group',
  children: [
     {
      id: 'my-seances',
      title: 'My Seances',
      type: 'item',
      url: '/my-seance',
      icon: icons.IconBarbell,
      breadcrumbs: false
    },
    {
      id: 'create-seance',
      title: 'Create Seance',
      type: 'item',
      url: '/create-seance',
      icon: icons.IconFilePlus,
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

export default seance;
