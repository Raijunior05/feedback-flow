// Adicione 'Delete' e 'Param' aqui na lista de imports
import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param } from '@nestjs/common'; 
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.userId);
  }

  // Verifique se esta função está exatamente assim:
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/stats')
  getProjectStats(@Param('id') id: string, @Request() req) {
    return this.projectsService.getStats(id, req.user.userId);
  }
}