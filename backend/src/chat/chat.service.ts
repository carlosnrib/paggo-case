import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

@Injectable()
export class ChatService {
  async chat(invoiceData: string, userInput: string): Promise<string> {
    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-pro",
        temperature: 0, 
      });

      const systemTemplate = `You are an AI assistant tasked with analyzing invoice data and answering user questions about it. 

        **Invoice Data:**

        {invoice_data}

        **User Question:**

        {user_input}

        **Instructions:**

        - Use the analyzed invoice data to provide a concise and accurate answer to the user's question.
        - If the question cannot be answered based on the invoice data, state so explicitly.

        **Example:**

        **Invoice Data:** 
        This invoice from 'Acme Corp' dated '2024-11-15' (invoice # 'INV-1234') includes:
        * 1 x Widget A: $10.00
        * 2 x Widget B: $5.00 each
        * 1 x Widget C: $20.00
        
        **User Question:** 
        What is the total cost of Widget B?

        **Answer:** 
        The total cost of Widget B is $10.00 (2 units * $5.00/unit).

        **Note:**

        * The provided invoice data may be in a variety of formats. 
        * Focus on extracting the most relevant and important information.
        * If any information is missing or ambiguous, state so explicitly.`;

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
      ]);

      const input = await prompt.format({ invoice_data: invoiceData, user_input: userInput });

      const response = await model.invoke(input);

      return response.content.toString(); 
    } catch (error) {
      console.error('Error analyzing invoice data:', error);
      throw new Error('Failed to analyze invoice data');
    }
  }
}