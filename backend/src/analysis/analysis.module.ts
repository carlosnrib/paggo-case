import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AnalysisService, PrismaService],
  controllers: [AnalysisController]
})
export class AnalysisModule {}
