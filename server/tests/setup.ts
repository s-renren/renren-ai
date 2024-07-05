import { exec } from 'child_process';
import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { encode } from 'iconv-lite';
import { http, passthrough } from 'msw';
import { setupServer } from 'msw/node';
import { basename, join } from 'path';
import { init } from 'service/app';
import { SERVER_PORT } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import util from 'util';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

const mswServer = setupServer(
  http.get('https://www.aozora.gr.jp/*', async (req) => {
    const filePath = join(__dirname, 'www.aozora.gr.jp/files', basename(req.request.url));

    return new Response(encode(readFileSync(filePath, 'utf8'), 'Shift_JIS'));
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
