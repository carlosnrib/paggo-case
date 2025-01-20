import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from './prisma/prisma.service'; 
import { OcrService } from './ocr.service';
  
  @Controller('upload')
  export class UploadController {
    constructor(
      private readonly ocrService: OcrService,
      private readonly prisma: PrismaService,
    ) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body('userId') userId: string,
    ) {
      if (!file) {
        throw new Error('No file uploaded');
      }

      if (!userId) {
        throw new BadRequestException('UserId is required');
      }

      const invoice = await this.prisma.invoice.create({
        data: {
          image: file.buffer, 
          userId: userId, 
          createdAt: new Date(),
        },
      });
  
      const result = await this.ocrService.processImage(file.buffer);
      return { text: result, invoiceId: invoice.id };
    }
  }
  