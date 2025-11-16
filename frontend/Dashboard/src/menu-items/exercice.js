// assets
import { IconBrandChrome, IconHelp, IconBarbell, IconFilePlus, IconEye } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp, IconBarbell, IconFilePlus, IconEye };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const exercice = {
  id: 'exercice-pages',
  title: 'Exercice',
  type: 'group',
  children: [
     {
      id: 'my-exercices',
      title: 'My Exercices',
      type: 'item',
      url: '/my-exercice',
      icon: icons.IconEye,
      breadcrumbs: false
    },
    // {
    //   id: 'create-seance',
    //   title: 'Create Seance',
    //   type: 'item',
    //   url: '/create-seance',
    //   icon: icons.IconFilePlus,
    //   breadcrumbs: false
    // },
   
  ]
};

export default exercice;
