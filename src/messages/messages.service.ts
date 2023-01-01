import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { JoinRoomDto } from './dto/join-room.dto';

interface IdentifyProps {
  body: JoinRoomDto
  client: Socket
}

export interface FindAllMessagesResponse {
  messages: Message[];
}

//TODO communication with mongodb database
@Injectable()
export class MessagesService {
  messages: Message[] = [
    {
      user: 'Andre',
      text: 'first generated message'
    }
  ]
  clientToUser = {}

  async create(createMessageDto: CreateMessageDto) {
    const message = {...createMessageDto};
    this.messages.push(createMessageDto)
    return message; //TODO improve createMessage 
  }

  findAll(): FindAllMessagesResponse {
    return {
      messages: this.messages
    };
  }

  async identify(props: IdentifyProps) {
    this.clientToUser[props.client.id] = props.body.user;
    return Object.values(this.clientToUser);
  }

  async getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

}
