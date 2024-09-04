import type { Project, ProjectDetails } from '@/types';
import { PaginationParams } from '../../types/api';

export type ProjectsState = {
  projects: Project[];
  pagination: PaginationParams;
  isLoading: boolean;
  sorting: {
    sortBy: string;
    desc: boolean;
  };
};

export type ProjectDetailsState = {
  project: ProjectDetails | null;
  isLoading: boolean;
  isFetching: boolean;
};

export type PickProjectState = {
  projects: Project[];
  isLoading: boolean;
};
