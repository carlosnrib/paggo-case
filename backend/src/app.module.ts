import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { OcrService } from './ocr.service';
import { AuthModule } from './auth/auth.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  controllers: [UploadController],
  providers: [OcrService],
  imports: [AuthModule, AnalysisModule]
})
export class AppModule {}
