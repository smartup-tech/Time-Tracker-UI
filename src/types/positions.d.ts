export interface CreatePosition {
  name: string;
  externalRate?: number;
}

export interface Position extends CreatePosition {
  id: number;
  archived: boolean;
  createdDate: string;
  lastModifiedDate: string;
}
