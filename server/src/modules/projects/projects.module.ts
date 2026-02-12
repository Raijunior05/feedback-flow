import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/prisma/prisma.service'; // Adicione o Prisma aqui

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService], // Registre o PrismaService
})
export class ProjectsModule {}