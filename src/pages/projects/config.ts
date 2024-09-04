import { PageName, paths } from '@/pages/config';

import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

export const projectsBreadcrumbs: Route[] = [
  {
    path: paths[PageName.PROJECTS],
    breadcrumbName: 'Проекты',
  },
];
