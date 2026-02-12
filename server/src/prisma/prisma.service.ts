import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Criamos a conexão (Pool) usando a string HARDCODED para garantir que funcione
    // Usamos 'localhost' pois o NestJS está rodando no seu terminal, fora do Docker
    const connectionString = 'postgresql://admin:password123@localhost:5432/feedback_flow?schema=public';

    // 2. Iniciamos o Pool do driver nativo do Postgres
    const pool = new Pool({ connectionString });

    // 3. Criamos o adaptador do Prisma para esse driver
    const adapter = new PrismaPg(pool);

    // 4. Passamos o adaptador para o super(), satisfazendo o erro que você recebeu
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}