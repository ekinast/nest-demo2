import { PickType } from '@nestjs/swagger';
import { UserDTO } from './CreateUser.dto';

export class UserCredentialsDto extends PickType(UserDTO, [
  'email',
  'password',
]) {}
