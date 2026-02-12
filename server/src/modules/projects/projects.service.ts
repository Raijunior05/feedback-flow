import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        userId: userId, // Vinculamos o projeto ao usuário logado
      },
    });
  }
  async findAll(userId: string) {
  return this.prisma.project.findMany({
    where: {
      userId: userId, // Garante que o Dinho só veja os projetos do Dinho
    },
    include: {
      _count: {
        select: { feedbacks: true }, // Já deixa pronto para mostrar quantos feedbacks cada projeto tem
      },
    },
  });
}
async remove(id: string, userId: string) {
  // Garantimos que o projeto existe e pertence ao usuário logado antes de deletar
  return this.prisma.project.deleteMany({
    where: {
      id: id,
      userId: userId,
    },
  });
}
async getStats(projectId: string, userId: string) {
  // Verificamos se o projeto pertence ao usuário logado (Segurança!)
  const project = await this.prisma.project.findFirst({
    where: { id: projectId, userId: userId },
  });

  if (!project) throw new Error('Projeto não encontrado');

  const totalFeedbacks = await this.prisma.feedback.count({
    where: { projectId },
  });

  // Pega feedbacks criados nas últimas 24 horas
  const last24h = await this.prisma.feedback.count({
    where: {
      projectId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  return {
    projectName: project.name,
    totalFeedbacks,
    newFeedbacks24h: last24h,
  };
}
}