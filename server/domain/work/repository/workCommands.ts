import type { Prisma } from '@prisma/client';
import type { WorkEntity } from 'api/@types/work';

export const workCommand = {
  save: async (tx: Prisma.TransactionClient, work: WorkEntity): Promise<void> => {
    await tx.work.upsert({
      where: { id: work.id },
      update: { status: work.status, errorMsg: work.errorMsg },
      create: {
        id: work.id,
        title: work.title,
        author: work.author,
        novelUrl: work.novelUrl,
        status: work.status,
        errorMsg: work.errorMsg,
        createdAt: new Date(work.createdTime),
      },
    });
  },
};
