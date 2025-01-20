import { Module } from '@nestjs/common';
import { UploadController } from './invoices/upload.controller';
import { OcrService } from './invoices/ocr.service';
import { AuthModule } from './auth/auth.module';
import { AnalysisModule } from './analysis/analysis.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  controllers: [UploadController],
  providers: [OcrService],
  imports: [AuthModule, AnalysisModule, PrismaModule, CloudinaryModule]
})
export class AppModule {}
