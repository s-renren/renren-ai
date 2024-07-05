import { workUseCase } from 'domain/work/useCase/workUseCase';
import { defineController } from './$relay';
import { prismaClient } from 'service/prismaClient';
import { workQuery } from 'domain/work/repository/workQuery';

export default defineController(() => ({
  get: () =>
    workQuery.listAll(prismaClient)
  .then(works =>
  ({ status: 200, body: works})),
  post: ({ body }) =>
    workUseCase.create(body.novelUrl).then((work) => ({ status: 200, body: work })),
}));
