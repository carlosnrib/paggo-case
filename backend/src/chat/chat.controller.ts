import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly ChatService: ChatService,
    private readonly prisma: PrismaService
  ) {}

  @Post('create')
  async createChat(
    @Body('invoice_data') invoiceData: string,
    @Body('invoice_id') invoiceId: string,
    @Body('user_id') userId: string
  ) {
    if (!invoiceData) {
      return { error: 'Invoice data is required' };
    }

    if (!invoiceId) {
      return { error: 'Invoice id is required' };
    }

    if (!userId) {
      return { error: 'User id is required' };
    }

    try {
      const chat = await this.prisma.chat.create({
        data: {
          invoiceId: invoiceId,
          userId: userId,
          message: []  
        },
      });

      return { chatId: chat.id };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('ask')
  async askLlm(
    @Body('invoice_data') invoiceData: string,
    @Body('invoice_id') invoiceId: string,
    @Body('user_id') userId: string,
    @Body('chat_id') chatId: string,  
    @Body('user_input') userInput: string
    ) {
        if (!invoiceData) {
        return { error: 'Invoice data is required' };
        }

        if (!invoiceId) {
        return { error: 'Invoice id is required' };
        }

        if (!userId) {
        return { error: 'User id is required' };
        }

        if (!chatId) {
        return { error: 'Chat id is required' };
        }

        if (!userInput) {
        return { error: 'User input is required' };
        }

        try {
        const result = await this.ChatService.chat(invoiceData, userInput);

        const message = {
            "UserMessage": userInput,
            "AiMessage": result
        };

        const existingChat = await this.prisma.chat.findUnique({
            where: { id: chatId },
        });

        const updatedMessages = Array.isArray(existingChat?.message) ? [...existingChat.message, message] : [message];

        await this.prisma.chat.update({
            where: { id: chatId },
            data: { message: updatedMessages },
        });

        return {  AiMessage: result };
        } catch (error) {
        return { error: error.message };
        }
    }

    @Get(':chat_id/messages')
    async getMessages(@Param('chat_id') chatId: string) {
        if (!chatId) {
            return { error: 'Chat id is required' };
        }

        try {
            const chat = await this.prisma.chat.findUnique({
                where: { id: chatId },
                select: { message: true }, 
            });

            if (!chat) {
                return { error: 'Chat not found' };
            }

            return { messages: chat.message || [] }; 
        } catch (error) {
            return { error: error.message };
        }
    }

    @Get(':invoice_id/chat')
    async getChatFromInvoice(@Param('invoice_id') invoiceId: string) {
        if (!invoiceId) {
        return { error: 'Invoice ID is required' };
        }

        try {
        const chat = await this.prisma.chat.findFirst({
            where: { invoiceId },
        });

        if (!chat) {
            return { error: 'No chat found for this invoice' };
        }

        return { chat: chat };
        } catch (error) {
        return { error: error.message };
        }
    }
}
