import { Controller, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  async analyzeInvoice(
    @Body('invoice_data') invoiceData: string,
    @Body('invoice_id') invoiceId: string
  ) {
    if (!invoiceData) {
      return { error: 'Invoice data is required' };
    }

    if (!invoiceId) {
      return { error: 'Invoice id is required' };
    }

    try {
      const result = await this.analysisService.analyzeInvoice(invoiceData);

      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { aiAnalysis: result },
      });

      return { analysis: result };
    } catch (error) {
      return { error: error.message };
    }
  }
}
