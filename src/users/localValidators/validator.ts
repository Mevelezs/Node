import { Schema } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

@Schema()
export class Skills {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;
}
