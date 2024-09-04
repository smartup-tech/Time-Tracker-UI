import { PageName, paths } from '@/pages';

import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

export const approvalBreadcrumbs: Route[] = [
  {
    path: paths[PageName.TIMESHEET_APPROVAL],
    breadcrumbName: 'Согласование часов',
  },
];
