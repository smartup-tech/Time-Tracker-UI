import { paths, PageName } from '@/pages';
import { ProfilePage } from '@/pages/profile';

export const profileRoutes = [
  {
    path: paths[PageName.PROFILE],
    name: PageName.PROFILE,
    component: ProfilePage,
  },
];
