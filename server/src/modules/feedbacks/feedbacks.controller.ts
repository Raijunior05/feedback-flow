import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post() // Público: qualquer um envia
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(createFeedbackDto);
  }

  @UseGuards(AuthGuard('jwt')) // Protegido: só o Raimundo vê
  @Get('project/:projectId')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.feedbacksService.findAllByProject(projectId);
  }
}