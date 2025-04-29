import { Icons } from '../components/Icons';
import Logbook from '../screens/user/Logbook';
import Dashboard from '../screens/user/Dashboard';
import Feedback from '../screens/user/Feedback';

export const TAB_CONFIG = [
  {
    route: 'logbook',
    label: 'Logbook',
    component: Logbook,
    inactiveIcon: 'book-outline',
    activeIcon: 'book',
    iconType: Icons.Ionicons,
  },
  {
    route: 'dashboard',
    label: 'Dashboard',
    component: Dashboard,
    inactiveIcon: 'view-dashboard-outline',
    activeIcon: 'view-dashboard',
    iconType: Icons.MaterialCommunityIcons,
  },
  {
    route: 'feedback',
    label: 'Feedback',
    component: Feedback,
    inactiveIcon: 'page',
    activeIcon: 'page-edit',
    iconType: Icons.Foundation,
  },
]; 