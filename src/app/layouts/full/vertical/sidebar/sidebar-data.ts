import { NavItem } from './nav-item/nav-item';
const userRolesString = localStorage.getItem('role');



const allNavItems: NavItem[] = [
  {
    navCap: 'Dashboard',
  },
 
 
  
  
  {
    navCap: 'Tables',
  },
  {
    displayName: 'All Users',
    iconName: 'border-outer',
    route: 'datatable/users',
    requiredRole: 'ROLE_ADMIN',
  },
  {
    displayName: 'ALL Tasks',
    iconName: 'border-outer',
    route: 'datatable/alltasks',
    requiredRole: 'ROLE_FREELANCER',
  },
  {
    displayName: 'Review Works',
    iconName: 'border-outer',
    route: 'datatable/review',
    requiredRole: 'ROLE_CLIENT',
  },
  {
    displayName: 'MY Posts',
    iconName: 'border-outer',
    route: 'datatable/alltasksbyclient',
    requiredRole: 'ROLE_CLIENT',
  },
  {
    displayName: 'Chat',
    iconName: 'border-outer',
    route: 'apps/chat',
    requiredRole: 'ROLE_CLIENT',
  },
  {
    displayName: 'Chat',
    iconName: 'border-outer',
    route: 'apps/chat',
    requiredRole: 'ROLE_FREELANCER',
  },
  {
    displayName: 'My Reviews',
    iconName: 'border-outer',
    route: 'datatable/reviews',
    requiredRole: 'ROLE_FREELANCER',
  },
  {
    displayName: 'My works',
    iconName: 'border-outer',
    route: 'datatable/freelancertasks',
    requiredRole: 'ROLE_FREELANCER',
  },
  
  
];

// Filter navigation items based on user permissions
export const navItems: NavItem[] = allNavItems.filter(item => {
  return !item.requiredRole || item.requiredRole === userRolesString;
});