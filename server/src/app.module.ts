import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './modules/users/users.controller'; 
import { UsersService } from './modules/users/users.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';

@Module({
  imports: [AuthModule, ProjectsModule, FeedbacksModule],
  controllers: [AppController, UsersController], 
  providers: [AppService, PrismaService, UsersService], 
})
export class AppModule {}