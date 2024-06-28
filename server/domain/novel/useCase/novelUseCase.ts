import { transaction } from 'service/prismaClient';

export const novelUseCase = {
  scrape: (aozoraUrl: string): Promise<string> =>
    transaction('RepeatableRead', async (tx) => {
      return aozoraUrl;
    }),
};
