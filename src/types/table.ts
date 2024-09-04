import { ColumnType } from 'ant-design-vue/lib/table';
// TODO: Remove this interface from project when record type issue is fixed https://github.com/vueComponent/ant-design-vue/issues/7255
export interface BodyCell<T = ColumnType> {
  column: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: any;
  text: string;
}
