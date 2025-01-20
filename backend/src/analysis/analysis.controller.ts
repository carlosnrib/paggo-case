import { Controller, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  async analyzeInvoice(@Body('invoice_data') invoiceData: string) {
    if (!invoiceData) {
      return { error: 'Invoice data is required' };
    }

    try {
      const result = await this.analysisService.analyzeInvoice(invoiceData);
      return { analysis: result };
    } catch (error) {
      return { error: error.message };
    }
  }
}
