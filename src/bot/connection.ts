// src/bot/connection.ts
import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { logger } from '../utils/logger';
import { onMessageReceived } from './handlers/messageHandler';

export async function connectToWhatsApp(): Promise<void> {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_asistmalek');

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.macOS('Chrome'),
    printQRInTerminal: true,   // Muestra QR en terminal
    syncFullHistory: false,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      logger.info('QR generado. Escanea con WhatsApp > Dispositivos vinculados.');
    }

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      logger.warn(`Conexión cerrada. Reconectando: ${shouldReconnect}`);
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === 'open') {
      logger.success('AsistMalek conectado correctamente.');
    }
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', (event) => onMessageReceived(sock, event));
}