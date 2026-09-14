// src/services/qrDecoder.ts
import jsQR from 'jsqr';
import { Jimp } from 'jimp';

export interface QRResult {
  success: boolean;
  data?: string;
  error?: string;
}

export async function decodeQRFromBuffer(imageBuffer: Buffer): Promise<QRResult> {
  try {
    // Leer imagen con Jimp
    const image = await Jimp.read(imageBuffer);
    const { data, width, height } = image.bitmap;

    // jsQR espera Uint8ClampedArray RGBA
    const qrCode = jsQR(new Uint8ClampedArray(data), width, height, {
      inversionAttempts: 'dontInvert',
    });

    if (!qrCode) {
      return { success: false, error: 'No se encontró un código QR en la imagen.' };
    }

    return { success: true, data: qrCode.data };
  } catch (err) {
    return {
      success: false,
      error: `Error al procesar la imagen: ${(err as Error).message}`,
    };
  }
}