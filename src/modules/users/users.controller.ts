import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/middlewares/multer';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Signup user' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin user' })
  signin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signin(createUserDto);
  }

  @Get('get-all')
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('get-single/:id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete('delete/:id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({ summary: 'Delete user by id' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('update/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiConsumes('multipart/form-data') 
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.update(+id, updateUserDto, file);
  }
}
