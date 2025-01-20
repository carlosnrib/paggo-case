import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { OcrService } from './ocr.service';
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly ocrService: OcrService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new Error('No file uploaded');
      }
  
      const result = await this.ocrService.processImage(file.buffer);
      return { text: result };
    }
  }
  