import type { LoadingWorkEntity } from 'api/@types/work';
import { getContetnKey, getImageKey } from 'service/getS3Key';
import { transaction } from 'service/prismaClient';
import { s3 } from 'service/s3Client';
import { workEvent } from '../event/workEvent';
import { workMethod } from '../model/workMethod';
import { novelQuery } from '../repository/novelQuery';
import { workCommand } from '../repository/workCommands';

export const workUseCase = {
  create: (novelUrl: string): Promise<LoadingWorkEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const { title, author, html } = await novelQuery.sccrape(novelUrl);
      const loadingWork = await workMethod.create({ novelUrl, title, author });

      await workCommand.save(tx, loadingWork);
      await s3.PutText(getContetnKey(loadingWork.id), html);

      workEvent.workCreated({ loadingWork, html });

      return loadingWork;
    }),
  conplete: (loadingWork: LoadingWorkEntity, image: Buffer): Promise<void> =>
    transaction('RepeatableRead', async (tx) => {
      const completedWork = await workMethod.complete(loadingWork);

      await workCommand.save(tx, completedWork);
      await s3.putImage(getImageKey(completedWork.id), image);
    }),
  failure: (loadingWork: LoadingWorkEntity, errorMsg: string): Promise<void> =>
    transaction('RepeatableRead', async (tx) => {
      const failedWork = workMethod.failure(loadingWork, errorMsg);

      await workCommand.save(tx, failedWork);
    }),
};
