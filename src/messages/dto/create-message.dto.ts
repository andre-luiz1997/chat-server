import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { Message } from "../entities/message.entity";

export class CreateMessageDto extends Message {
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsString()
  @IsNotEmpty()
  text: string;
}
