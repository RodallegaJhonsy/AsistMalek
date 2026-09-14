// src/services/mediaDownloader.ts
import { downloadMediaMessage, proto } from '@whiskeysockets/baileys';

export async function downloadImageBuffer(
  msg: proto.IWebMessageInfo
): Promise<Buffer> {
  const buffer = await downloadMediaMessage(
    msg,
    'buffer',
    {},
    { logger: undefined as never, reuploadRequest: undefined as never }
  );
  return buffer as Buffer;
}