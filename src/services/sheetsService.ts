// src/services/sheetsService.ts
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { config } from '../config/env';
import { logger } from '../utils/logger';

const serviceAccountAuth = new JWT({
  email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: config.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(config.GOOGLE_SHEET_ID, serviceAccountAuth);

export interface Estudiante {
  id: string;
  nombre: string;
  email: string;
  grupo: string;
}

let sheet: any = null;

async function getSheet() {
  if (!sheet) {
    await doc.loadInfo();
    sheet = doc.sheetsByTitle['Estudiantes'] ?? doc.sheetsByIndex[0];
  }
  return sheet;
}

export async function buscarEstudiante(qrData: string): Promise<Estudiante | null> {
  const rows = await (await getSheet()).getRows();
  const row = rows.find((r: any) => r.get('ID') === qrData);
  if (!row) return null;
  return {
    id: row.get('ID'),
    nombre: row.get('Nombre'),
    email: row.get('Email'),
    grupo: row.get('Grupo'),
  };
}

export async function registrarAsistencia(
  estudiante: Estudiante,
  fecha: Date
): Promise<void> {
  const asistenciaSheet = doc.sheetsByTitle['Asistencias'];
  await asistenciaSheet.addRow({
    Fecha: fecha.toISOString(),
    ID: estudiante.id,
    Nombre: estudiante.nombre,
    Email: estudiante.email,
    Grupo: estudiante.grupo,
  });
  logger.info(`Fila añadida en Asistencias para ${estudiante.nombre}`);
}