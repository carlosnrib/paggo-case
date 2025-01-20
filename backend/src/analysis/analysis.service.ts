import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

@Injectable()
export class AnalysisService {
  async analyzeInvoice(invoiceData: string): Promise<string> {
    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-pro",
        temperature: 0, 
      });

      const systemTemplate = `You are an AI assistant tasked with analyzing invoice data. 

        Given the following information extracted from an invoice: 

        {invoice_data}

        Please provide a concise summary of the invoice, including:

        * **Vendor/Store Name:** Clearly identify the business that issued the invoice.
        * **Date of Purchase:** Specify the date when the purchase was made.
        * **Invoice Number:** If available, provide the unique invoice number.
        * **Purchased Items:** List the items purchased, including their quantities and unit prices. 
        * **Total Amount:** Calculate and state the total amount of the invoice, including any applicable taxes or discounts.

        Present the information in a clear and organized manner. 

        **Example:**

        "This invoice from 'Acme Corp' dated '2024-11-15' (invoice # 'INV-1234') includes:
        * 1 x Widget A: $10.00
        * 2 x Widget B: $5.00 each
        * 1 x Widget C: $20.00

        Total: $40.00" 

        **Note:**

        * The provided invoice data may be in a variety of formats. 
        * Focus on extracting the most relevant and important information.
        * If any information is missing or ambiguous, state so explicitly.`;

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
      ]);

      const input = await prompt.format({ invoice_data: invoiceData });

      const response = await model.invoke(input);

      return response.content.toString(); 
    } catch (error) {
      console.error('Error analyzing invoice data:', error);
      throw new Error('Failed to analyze invoice data');
    }
  }
}