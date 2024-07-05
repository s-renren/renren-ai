import type { LoadingWorkEntity } from 'api/@types/work';
import { transaction } from 'service/prismaClient';
import { workMethod } from '../model/workMethod';
import { novelQuery } from '../repository/novelQuery';
import { workCommand } from '../repository/workCommands';

export const workUseCase = {
  create: (novelUrl: string): Promise<LoadingWorkEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const { title, author } = await novelQuery.sccrape(novelUrl);
      const LoadingWork = workMethod.create({ novelUrl, title, author });

      await workCommand.save(tx, LoadingWork);

      return LoadingWork;
    }),
};
