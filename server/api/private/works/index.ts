import type { LoadingWorkEntity, WorkEntity } from 'api/@types/work';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: WorkEntity[];
  };
  post: {
    reqBody: { novelUrl: string; title: string; author: string };
    resBody: LoadingWorkEntity;
  };
}>;
