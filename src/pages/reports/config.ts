import { PageName, paths } from '@/pages';

import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

export const reportsBreadcrumbs: Route[] = [
  {
    path: paths[PageName.REPORTS],
    breadcrumbName: 'Отчеты',
  },
];
