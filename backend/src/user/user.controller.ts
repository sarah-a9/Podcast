import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
     return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new HttpException('User Not Found' , 404);
    const findUser = await this.userService.findOne(id);
    if (!findUser) throw new HttpException("User Not Found", 404);
    return findUser;

    // return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException("Invalid ID", 400);
    const updateUser = await this.userService.update(id , updateUserDto);
    if (!updateUser) throw new HttpException('User Not Found' , 404);
    return updateUser;
    
    // return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new HttpException("Invalid ID" , 400);
  const deletedUser = this.userService.remove(id);
  if (!deletedUser) throw new HttpException("User Not Found", 404);
  return deletedUser;

    // return this.userService.remove(+id);
  }
}
