import type { TableProps } from 'ant-design-vue';

export const useUserProjectsConfig = () => {
  const columns: TableProps['columns'] = [
    {
      key: 'name',
      title: 'Проект',
    },
    {
      key: 'role',
      title: 'Роль',
    },
    {
      key: 'rate',
      title: 'Ставка',
      width: 120,
      align: 'right',
    },
    {
      key: 'actions',
      align: 'right',
      width: 160,
    },
  ];

  return { columns };
};
