import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';
import { GET, POST } from './utils';

test(GET(noCookieClient.novel), async () => {
  const res = await noCookieClient.novel.$get();

  expect(res).toEqual('Hello');
});

test(POST(noCookieClient.novel), async () => {
  const aozoraUrl = noCookieClient.novel.$path();
  const res = await noCookieClient.novel.$post({ body: { aozoraUrl } });

  expect(typeof res).toEqual('string');
});
