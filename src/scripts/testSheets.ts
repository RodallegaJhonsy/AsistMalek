import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { config } from '../config/env';

async function main() {
  console.log('🔍 Conectando con Google Sheets...\n');

  const auth = new JWT({
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: config.GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(config.GOOGLE_SHEET_ID, auth);

  try {
    await doc.loadInfo();
    console.log(`✅ Hoja conectada: "${doc.title}"`);
    console.log(`📄 Pestañas disponibles:`);
    doc.sheetsByIndex.forEach((s) => {
      console.log(`   - ${s.title} (${s.rowCount} filas, ${s.columnCount} columnas)`);
    });

    console.log('\n🔎 Leyendo estudiantes...');
    const estudiantesSheet = doc.sheetsByTitle['Estudiantes'];
    if (!estudiantesSheet) {
      console.error('❌ No existe la pestaña "Estudiantes".');
      return;
    }
    const rows = await estudiantesSheet.getRows();
    console.log(`📊 Total de estudiantes: ${rows.length}`);
    rows.slice(0, 3).forEach((r, i) => {
      console.log(
        `   ${i + 1}. ID=${r.get('ID')} | Nombre=${r.get('Nombre')} | Email=${r.get('Email')} | Grupo=${r.get('Grupo')}`
      );
    });

    console.log('\n✍️  Probando escritura en "Asistencias"...');
    const asistSheet = doc.sheetsByTitle['Asistencias'];
    if (!asistSheet) {
      console.error('❌ No existe la pestaña "Asistencias".');
      return;
    }

    await asistSheet.loadHeaderRow();

    if (!asistSheet.headerValues || asistSheet.headerValues.length === 0) {
      await asistSheet.setHeaderRow(['Fecha', 'ID', 'Nombre', 'Email', 'Grupo']);
      console.log('🧩 Se crearon los encabezados de la pestaña "Asistencias".');
    }

    await asistSheet.addRow({
      Fecha: new Date().toISOString(),
      ID: 'TEST-001',
      Nombre: 'Prueba AsistMalek',
      Email: 'test@asistmalek.local',
      Grupo: 'TEST',
    });
    console.log('✅ Fila de prueba añadida correctamente.');
    console.log('\n🎉 Todo funciona. Revisa tu Google Sheet.');
  } catch (err) {
    console.error('\n❌ Error:', (err as Error).message);
    console.error('\nPosibles causas:');
    console.error(' - La hoja no está compartida con el client_email como Editor.');
    console.error(' - El GOOGLE_SHEET_ID es incorrecto.');
    console.error(' - La GOOGLE_PRIVATE_KEY está mal escapada en el .env.');
    console.error(' - No habilitaste Google Sheets API o Google Drive API.');
  }
}

main();