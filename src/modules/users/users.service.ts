import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { generateToken, uploadOnCloudinary } from 'src/common/utils/helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async signup(createUserDto: CreateUserDto): Promise<{ user: { id: number, name: string, email: string }, token: string }> {
    let emailExists = await this.userRepo.findOne({
      where: { email: createUserDto.email }
    })

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    let hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const data = {
      ...createUserDto,
      password: hashedPassword,
    }
    const user = this.userRepo.create(data);
    const savedUser = await this.userRepo.save(user);
    console.log("user data check ->>>>>>>", user);

    const token = await generateToken({ id: savedUser.id, name: savedUser.name, email: savedUser.email });
    console.log("token data check ->>>>>>>", token);

    const returnData: { user: { id: number, name: string, email: string }, token: string } = {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email
      },
      token
    }

    return returnData;
  }

  async signin(createUserDto: CreateUserDto): Promise<{ user: { id: number, name: string, email: string }, token: string }> {
    const user = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    })

    console.log("user data check ->>>>>>>", user);

    if (!user) {
      throw new NotFoundException('Email does not exist');
    }

    let isPasswordCorrect = await bcrypt.compare(createUserDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const token = await generateToken({ id: user.id, name: user.name, email: user.email });
    console.log("token data check ->>>>>>>", token);

    const data = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }

    return data;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'name', 'email', 'createdAt'],
    });
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepo.findOne(
      { where: { id }, select: ['id', 'name', 'email', 'createdAt'] })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

  async update(id: number, updateUserDto: CreateUserDto, file?: Express.Multer.File): Promise<any> {
    const ifUserExists = await this.userRepo.findOne({ where: { id } });

    if (!ifUserExists) {
      throw new NotFoundException('User not found');
    }

    let image:any = null
    if (file) {
      image = await uploadOnCloudinary(file.buffer)
    }

    const data = {
      ...updateUserDto,
      image: image.secure_url
    }

    await this.userRepo.update(id, data);
    return this.userRepo.findOne({ where: { id }, select: ['id', 'name', 'email', 'image', 'createdAt'] });
  }
}
