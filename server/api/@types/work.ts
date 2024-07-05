import type { EntityId } from './brandedId';

type WorkBase = {
  id: EntityId['work'];
  novelUrl: string;
  title: string;
  author: string;
  createdTime: number;
};

export type LoadingWorkEntity = WorkBase & {
  status: 'loading';
  imageUrl: null;
  errorMsg: null;
};

export type CompletedWorkEntity = WorkBase & {
  status: 'completed';
  imageUrl: string;
  errorMsg: null;
};

export type FailedWorkEntity = WorkBase & {
  status: 'failed';
  imageUrl: null;
  errorMsg: string;
};

export type WorkEntity = LoadingWorkEntity | CompletedWorkEntity | FailedWorkEntity;
