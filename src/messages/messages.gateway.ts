import { FindAllMessagesResponse } from '../messages/dto/find-all-messages.dto';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { EVENTS } from 'src/constants';
import { JoinRoomDto } from './dto/join-room.dto';
import { TypingDto } from './dto/typing.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  @WebSocketServer() server: Server; //reference to the socket.io server directly

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage(EVENTS.CREATE_MESSAGE_EVENT)
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    console.log({message});

    this.server.emit(EVENTS.MESSAGE_EVENT, {message});
    return message;
  }

  @SubscribeMessage(EVENTS.FIND_ALL_MESSAGES_EVENT)
  findAll(): FindAllMessagesResponse {
    return this.messagesService.findAll();
  }

  @SubscribeMessage(EVENTS.JOIN_EVENT)
  joinRoom(
    @MessageBody() body: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.identify({
      body,
      client,
    });
  }

  @SubscribeMessage(EVENTS.TYPING_EVENT)
  async typing(
    @MessageBody() body: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.messagesService.getClientName(client.id);
    client.broadcast.emit(EVENTS.TYPING_EVENT, {
      user,
      isTyping: body.isTyping,
    });
  }
}
