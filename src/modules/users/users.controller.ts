import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
}
