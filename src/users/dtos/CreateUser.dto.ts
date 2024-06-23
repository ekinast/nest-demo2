import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'El nombre del usuario debe tener al menos 3 caracteres.',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'El email debe un email válido.',
    example: 'jdoe@mail.com',
    type: String,
  })
  email: string;

  /**
   * @description 'La contraseña debe ser difícil de encontrar.',
   * @example 'Strong!(Password)'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  // @ApiProperty({
  //   description: 'La contraseña debe ser difícil de encontrar.',
  //   example: 'Strong!(Password)',
  //   type: String,
  // })
  password: string;

  // @IsEmpty()
  // @ApiProperty({
  //   description:
  //     'Asignada por defecto al momento de crear el usuario, no debe ser incluida en el body.',
  //   default: false,
  // })
  // IsAdmin: boolean;
}
