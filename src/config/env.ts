import 'dotenv/config';

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Falta variable de entorno: ${key}`);
  return value;
}

export const config = {
  LOBBY_GROUP_JID: required('LOBBY_GROUP_JID'),
  REGISTRY_GROUP_JID: required('REGISTRY_GROUP_JID'),
  GOOGLE_SHEET_ID: required('GOOGLE_SHEET_ID'),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: required('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
  GOOGLE_PRIVATE_KEY: required('GOOGLE_PRIVATE_KEY'),
};