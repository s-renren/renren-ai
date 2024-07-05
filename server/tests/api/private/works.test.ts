import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from '../apiClient';
import { GET, POST } from '../utils';

test(GET(noCookieClient.private.works), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.works.$get();

  expect(res).toHaveLength(0);
});

test(
  POST(noCookieClient.private.works),
  async () => {
    const userClient = await createUserClient();
    const novelUrl = 'https://www.aozora.gr.jp/cards/000081/files/45630_23908.html';

    await userClient.private.works.$post({ body: { novelUrl } });

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const res = await userClient.private.works.$get();

      if (res[0].status !== 'loading') {
        expect(res[0].status).toBe('completed');
        expect(res[0].novelUrl).toBe(novelUrl);
        expect(res[0].title).toBe('〔雨ニモマケズ〕');
        expect(res[0].author).toBe('宮澤賢治');

        break;
      }
    }
  },
  300_000,
);
