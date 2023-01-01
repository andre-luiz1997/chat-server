import { Message } from "../entities/message.entity";

export interface FindAllMessagesResponse {
  messages: Message[];
}