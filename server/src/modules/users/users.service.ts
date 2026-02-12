import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // Gerar o "sal" (tempero extra de segurança) e criar o hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Salvar no banco com a senha já criptografada
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }
}