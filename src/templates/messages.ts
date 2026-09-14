// src/templates/messages.ts
import type { Estudiante } from '../services/sheetsService';

export const templates = {
  qrExitoso: (nombre: string) =>
    `✅ *Asistencia registrada*\n\n👤 ${nombre}\n🕐 ${new Date().toLocaleString('es-CO')}\n\nAsistMalek agradece tu puntualidad.`,

  qrError: (error?: string) =>
    `❌ *No se pudo escanear el código QR*\n\n${error ?? 'Asegúrate de que la imagen sea clara y el QR esté completo.'}\n\nIntenta de nuevo.`,

  estudianteNoEncontrado: (id: string) =>
    `⚠️ *Estudiante no encontrado*\n\nEl código QR leído (\`${id}\`) no está registrado en la base de datos.\nContacta a coordinación para verificar tu registro.`,

  notificacionRegistro: (e: Estudiante) =>
    `📋 *Nuevo registro de asistencia*\n\n👤 *Nombre:* ${e.nombre}\n🆔 *ID:* ${e.id}\n📧 *Email:* ${e.email}\n👥 *Grupo:* ${e.grupo}\n🕐 *Hora:* ${new Date().toLocaleString('es-CO')}`,

  errorInterno: () =>
    `🔧 *Error interno*\n\nOcurrió un problema al procesar tu solicitud. Intenta nuevamente o contacta al administrador.`,
};