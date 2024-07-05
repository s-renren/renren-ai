import type { Prisma, Work } from '@prisma/client';
import { WORK_STATUSES } from 'api/@constants';
import type { WorkEntity } from 'api/@types/work';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';

const toWorkEntity = (prismaWork: Work): WorkEntity => {
  const status = z.enum(WORK_STATUSES).parse(prismaWork.status);

  switch (status) {
    case 'loading':
      return {
        id: brandedId.work.entity.parse(prismaWork.id),
        status,
        novelUrl: prismaWork.novelUrl,
        title: prismaWork.title,
        author: prismaWork.author,
        createdTime: prismaWork.createdAt.getTime(),
        imageUrl: null,
        errorMsg: null,
      };
    case 'completed':
      return {
        id: brandedId.work.entity.parse(prismaWork.id),
        status,
        novelUrl: prismaWork.novelUrl,
        title: prismaWork.title,
        author: prismaWork.author,
        createdTime: prismaWork.createdAt.getTime(),
        imageUrl: 'null',
        errorMsg: null,
      };
    case 'failed':
      return {
        id: brandedId.work.entity.parse(prismaWork.id),
        status,
        novelUrl: prismaWork.novelUrl,
        title: prismaWork.title,
        author: prismaWork.author,
        createdTime: prismaWork.createdAt.getTime(),
        imageUrl: null,
        errorMsg: z.string().parse(prismaWork.errorMsg),
      };
    /* v8 ignore next 2 */
    default:
      throw new Error(status satisfies never);
  }
};

export const workQuery = {
  listAll: (tx: Prisma.TransactionClient): Promise<WorkEntity[]> =>
    tx.work.findMany().then((works) => works.map(toWorkEntity)),
};
