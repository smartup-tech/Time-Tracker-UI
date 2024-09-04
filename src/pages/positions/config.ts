import { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

import { PageName, paths } from '@/pages';

export const positionsBreadcrumbs: Route[] = [
  {
    path: paths[PageName.POSITION_LIST],
    breadcrumbName: 'Должности',
  },
];
