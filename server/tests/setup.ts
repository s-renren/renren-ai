import { exec } from 'child_process';
import { createHash } from 'crypto';
import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { encode } from 'iconv-lite';
import { delay, http, HttpResponse, passthrough } from 'msw';
import { setupServer } from 'msw/node';
import type { ChatCompletionCreateParamsNonStreaming, ImageGenerateParams } from 'openai/resources';
import { basename, join } from 'path';
import { init } from 'service/app';
import { OPENAI_BASE_URL, SERVER_PORT } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import util from 'util';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

const mswServer = setupServer(
  http.get('https://www.aozora.gr.jp/*', async (req) => {
    const filePath = join(__dirname, 'www.aozora.gr.jp/files', basename(req.request.url));

    return new Response(encode(readFileSync(filePath, 'utf8'), 'Shift_JIS'));
  }),
  http.post(`${OPENAI_BASE_URL}/chat/completions`, async (req) => {
    await delay();

    const body = (await req.request.json()) as ChatCompletionCreateParamsNonStreaming;
    const hash = createHash('md5')
      .update(body.messages[1].content as string)
      .digest('hex');

    const res = readFileSync(join(__dirname, 'api.openai.com/chat', `${hash}.json`), 'utf8');

    return HttpResponse.json(JSON.parse(res));
  }),
  http.post(`${OPENAI_BASE_URL}/images/generations`, async (req) => {
    await delay();

    const body = (await req.request.json()) as ImageGenerateParams;
    const hash = createHash('md5').update(body.prompt).digest('hex');
    const res = readFileSync(join(__dirname, 'api.openai.com/images', `${hash}.json`), 'utf8');

    return HttpResponse.json(JSON.parse(res));
  }),
  http.all('*', passthrough),
);

let server: FastifyInstance;

const unneededServer = (file: { filepath?: string } | undefined): boolean =>
  !/\/tests\/api\/.+\.test\.ts$/.test(file?.filepath ?? '');

beforeAll(async (info) => {
  if (unneededServer(info)) return;

  mswServer.listen();
  server = init();
  await server.listen({ port: SERVER_PORT, host: '0.0.0.0' });
});

beforeEach(async (info) => {
  if (unneededServer(info.task.file)) return;

  await util.promisify(exec)('npx prisma migrate reset --force');
  await util.promisify(exec)('npx prisma db seed');
});

afterEach(async (info) => {
  if (unneededServer(info.task.file)) return;

  mswServer.resetHandlers();
  await prismaClient.$disconnect();
});

afterAll(async (info) => {
  if (unneededServer(info)) return;

  mswServer.close();
  await server.close();
});
