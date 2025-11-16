import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import seance from './seance';
import exercice from './exercice';
import admin from './admin';

// ==============================|| MENU ITEMS ||============================== //

const getMenuItems = (user) => {
  const baseItems = [
    dashboard,
    seance,
    exercice,
  ];

  if (user?.roleName === "SUPER_ADMIN") {
    console.log("Adding admin menu items for SUPER_ADMIN");
    baseItems.unshift(admin);
  }

  return { items: baseItems };
};

export default getMenuItems;
