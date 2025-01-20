import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async processImage(buffer: Buffer): Promise<string> {
    try {
      const { data } = await Tesseract.recognize(buffer, 'por', {
        logger: (info) => console.log(info),
      });

      return data.text;
    } catch (error) {
      console.error('Error during OCR processing:', error);
      throw new Error('OCR processing failed');
    }
  }
}
