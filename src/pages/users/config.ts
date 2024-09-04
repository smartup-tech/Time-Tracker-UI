import { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

import { PageName, paths } from '@/pages';

export const usersBreadcrumbs: Route[] = [
  {
    path: paths[PageName.USERS],
    breadcrumbName: 'Сотрудники',
  },
];
