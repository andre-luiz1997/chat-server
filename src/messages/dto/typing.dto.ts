import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TypingDto {
  @IsBoolean()
  @IsNotEmpty()
  isTyping: boolean;
}
