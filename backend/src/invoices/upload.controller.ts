import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service'; 
import { OcrService } from './ocr.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('invoices')
export class UploadController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
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

    const cloudinaryUrl = await this.cloudinaryService.uploadImage(file.buffer, 'invoices');

    const result = await this.ocrService.processImage(file.buffer);

    const invoice = await this.prisma.invoice.create({
      data: {
        imageUrl: cloudinaryUrl, 
        userId: userId, 
        createdAt: new Date(),
        invoiceData: result,
      },
    });

    return { text: result, invoiceId: invoice.id };
  }

  @Get(':userId')
  async getInvoicesByUserId(@Param('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('UserId is required');
    }

    const invoices = await this.prisma.invoice.findMany({
      where: { userId }, 
    });

    return { invoices };
  }
}
