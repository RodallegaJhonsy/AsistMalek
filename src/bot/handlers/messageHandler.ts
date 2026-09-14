// src/bot/handlers/messageHandler.ts
import type { WASocket, WAMessage, proto } from '@whiskeysockets/baileys';
import { getContentType } from '@whiskeysockets/baileys';
import { config } from '../../config/env';
import { downloadImageBuffer } from '../../services/mediaDownloader';
import { decodeQRFromBuffer } from '../../services/qrDecoder';
import { buscarEstudiante, registrarAsistencia } from '../../services/sheetsService';
import { templates } from '../../templates/messages';
import { logger } from '../../utils/logger';

export async function onMessageReceived(
  sock: WASocket,
  event: { messages: proto.IWebMessageInfo[] }
): Promise<void> {
  const msg = event.messages[0];
  if (!msg.message || msg.key.fromMe) return;

  const remoteJid = msg.key.remoteJid ?? '';
  const senderJid = msg.key.participant ?? msg.key.remoteJid ?? '';
  const contentType = getContentType(msg.message);

  // Logging organizado
  logger.message({
    from: senderJid,
    group: remoteJid,
    type: contentType ?? 'unknown',
    timestamp: new Date(Number(msg.messageTimestamp) * 1000),
  });

  // Solo procesar imágenes en el grupo LOBBY
  if (remoteJid !== config.LOBBY_GROUP_JID) return;
  if (contentType !== 'imageMessage') return;

  try {
    // 1. Descargar imagen
    const buffer = await downloadImageBuffer(msg);

    // 2. Decodificar QR
    const qrResult = await decodeQRFromBuffer(buffer);

    if (!qrResult.success || !qrResult.data) {
      await sock.sendMessage(remoteJid, {
        text: templates.qrError(qrResult.error),
      });
      logger.warn(`QR no escaneado de ${senderJid}: ${qrResult.error}`);
      return;
    }

    // 3. Buscar estudiante en Google Sheets
    const estudiante = await buscarEstudiante(qrResult.data);

    if (!estudiante) {
      await sock.sendMessage(remoteJid, {
        text: templates.estudianteNoEncontrado(qrResult.data),
      });
      return;
    }

    // 4. Registrar asistencia
    await registrarAsistencia(estudiante, new Date());

    // 5. Confirmar en lobby
    await sock.sendMessage(remoteJid, {
      text: templates.qrExitoso(estudiante.nombre),
    });

    // 6. Notificar en grupo de registro
    await sock.sendMessage(config.REGISTRY_GROUP_JID, {
      text: templates.notificacionRegistro(estudiante),
    });

    logger.success(`Asistencia registrada: ${estudiante.nombre}`);
  } catch (err) {
    logger.error(`Error procesando mensaje: ${(err as Error).message}`);
    await sock.sendMessage(remoteJid, {
      text: templates.errorInterno(),
    });
  }
}