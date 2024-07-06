import type { CompletedWorkEntity, FailedWorkEntity, LoadingWorkEntity } from 'api/@types/work';
import { brandedId } from 'service/brandedId';
import { getContetnKey, getImageKey } from 'service/getS3Key';
import { s3 } from 'service/s3Client';
import { ulid } from 'ulid';

export const workMethod = {
  create: async (val: {
    novelUrl: string;
    title: string;
    author: string;
  }): Promise<LoadingWorkEntity> => {
    const id = brandedId.work.entity.parse(ulid());
    return {
      id,
      status: 'loading',
      novelUrl: val.novelUrl,
      title: val.title,
      author: val.author,
      contentUrl: await s3.getSignedUrl(getContetnKey(id)),
      createdTime: Date.now(),
      imageUrl: null,
      errorMsg: null,
    };
  },
  complete: async (loadingWork: LoadingWorkEntity): Promise<CompletedWorkEntity> => {
    return {
      ...loadingWork,
      status: 'completed',
      imageUrl: await s3.getSignedUrl(getImageKey(loadingWork.id)),
    };
  },
  failure: (loadingWork: LoadingWorkEntity, errorMsg: string): FailedWorkEntity => {
    return {
      ...loadingWork,
      status: 'failed',
      errorMsg,
    };
  },
};
