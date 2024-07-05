import { workUseCase } from 'domain/work/useCase/workUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: [] }),
  post: ({ body }) =>
    workUseCase.create(body.novelUrl).then((work) => ({ status: 200, body: work })),
}));
