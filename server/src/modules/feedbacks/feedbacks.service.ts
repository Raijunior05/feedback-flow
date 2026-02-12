import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        content: createFeedbackDto.content,
        projectId: createFeedbackDto.projectId,
      },
    });
  }
  async findAllByProject(projectId: string) {
  return this.prisma.feedback.findMany({
    where: {
      projectId: projectId, // Busca apenas os feedbacks deste projeto específico
    },
    orderBy: {
      createdAt: 'desc', // Mostra os mais recentes primeiro
    },
  });
  }
  
}