import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { MultipartFile } from '@fastify/multipart';
import { S3_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT, S3_REGION, S3_SECRET_KEY } from './envValues';

export type S3PutParams = { key: string; data: MultipartFile };

const s3Client = new S3Client({
  forcePathStyle: true,
  ...(S3_ACCESS_KEY && S3_ENDPOINT && S3_SECRET_KEY
    ? {
        endpoint: S3_ENDPOINT,
        region: S3_REGION,
        credentials: { accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_SECRET_KEY },
      }
    : {}),
});

export const s3 = {
  getSignedUrl: async (key: string): Promise<string> => {
    const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });

    return await getSignedUrl(s3Client, command, { expiresIn: 24 * 60 * 60 });
  },
  health: async (): Promise<boolean> => {
    const command = new ListObjectsV2Command({ Bucket: S3_BUCKET });

    return await s3Client.send(command).then(() => true);
  },
  PutText: async (key: string, text: string): Promise<void> => {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      ContentType: 'text/plain',
      Key: key,
      Body: text,
    });

    await s3Client.send(command);
  },
  putImage: async (key: string, image: Buffer): Promise<void> => {
    const ext = key.split('.').at(-1);
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      ContentType: ext === 'jpg' ? 'img/jpeg' : `image/${ext}`,
      Key: key,
      Body: image,
    });

    await s3Client.send(command);
  },
  putFile: async (params: S3PutParams): Promise<void> => {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      ContentType: params.data.mimetype,
      Key: params.key,
      Body: await params.data.toBuffer(),
    });

    await s3Client.send(command);
  },
  delete: async (key: string): Promise<void> => {
    const command = new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key });

    await s3Client.send(command);
  },
};
