import { UserDTO } from './dtos/CreateUser.dto';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Res,
  Req,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Body,
  ParseUUIDPipe,
  UploadedFiles,
  UploadedFile,
  UsePipes,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { DateAdderInterceptor } from '../interceptors/date-adder.interceptor';
import { UsersDBService } from './usersDB.service';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinSizeValidatorPipe } from '../pipes/min-size-validator.pipe';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dtos/UserCredentials.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
//@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDBService: UsersDBService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
  ) {
    console.log('UsersController instantiated');
  }

  @Get()
  getUsers(@Query('name') name?: string) {
    if (name) {
      return this.usersDBService.getUsersByName(name);
    }
    return this.usersDBService.getUsers();
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Req() request: Request & { user: any }) {
    console.log(request.user);
    return 'Este endpoint devolverá el perfil del usuario';
  }

  @Get('admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAdmin() {
    return 'Ruta protegida';
  }

  //? Subir archivos a Cloudinay.
  @ApiBearerAuth()
  @Post('profile/images')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(MinSizeValidatorPipe)
  getUserImages(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10000000,
            message: 'El archivo debe ser menor a 100kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    //return this.cloudinaryService.uploadImage(file);
    return file;
  }

  @HttpCode(418)
  @Get('coffe')
  getUserCoffe() {
    return 'No se hacer café, soy una tetera ';
  }

  @Get('message')
  getUserMessage(@Res() response: Response) {
    response.status(200).send('Este endpoint devolverá un mensaje');
  }

  @Get('request')
  getUserRequest(@Req() request: Request) {
    console.log(request);
    return 'Esta ruta loguea el request en la consola';
  }

  @Get('auth0/protected')
  getAuth0Protected(@Req() req: Request) {
    console.log(req.oidc.accessToken);
    //return 'Este endpoint devolverá un mensaje protegido';
    return JSON.stringify(req.oidc.user);
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ) {
    try {
      const user = await this.usersDBService.getUserById(id);
      return response.status(HttpStatus.OK).json(user);
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuario no encontrado' });
      } else {
        console.log('Error occurred:', error);
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal Server Error' });
      }
    }
  }

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  createUser(@Body() user: UserDTO, @Req() request: Request & { now: string }) {
    console.log({ user });

    return this.authService.signUp({
      ...user,
      createdAt: request.now,
    });
    // return this.usersService.createUser(user);
    //return 'Este endpoint creará un usuario';
  }

  @Post('signin')
  async signin(@Body() user: UserCredentialsDto) {
    return this.authService.signIn(user.email, user.password);
  }

  @Put()
  updateUser() {
    //return this.usersService.updateUser();
    return 'Este endpoint actualizará un usuario';
  }

  @Delete()
  deleteUser() {
    //return this.usersService.deleteUser();
    return 'Este endpoint eliminará un usuario';
  }
}
