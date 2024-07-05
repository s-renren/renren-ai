import type { LoadingWorkEntity } from 'api/@types/work';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';

export const workMethod = {
  create: (val: { novelUrl: string; title: string; author: string }): LoadingWorkEntity => {
    return {
      id: brandedId.work.entity.parse(ulid()),
      status: 'loading',
      novelUrl: val.novelUrl,
      title: val.title,
      author: val.author,
      createdTime: Date.now(),
      imageUrl: null,
      errorMsg: null,
    };
  },
};
