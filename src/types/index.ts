export interface BotConfig {
  port: number;
  botName: string;
  sessionName: string;
}

export interface MessagePayload {
  from: string;
  text?: string;
  media?: string;
  groupId?: string;
}

export interface QRData {
  code: string;
  source: string;
}
