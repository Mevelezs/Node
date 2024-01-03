import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ description: 'this atribute is an email of user' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password: string;

  @IsNotEmpty()
  readonly role: string;

  @IsPositive()
  readonly customerId: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
