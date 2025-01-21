"use client";

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; 
import Chat from '@/components/chat';
import api from '@/services/api';

interface AIResumeProps {
    invoiceData: string;
    invoiceId: string;
    userId: string;
    ai_analysis: string;
}

const AIResume: React.FC<AIResumeProps> = ({ ai_analysis, invoiceData, userId, invoiceId }) => {
    const [chatId, setChatId] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const createChat = async () => {
        try {
            const response = await api.post('chat/create', {
                invoice_data: invoiceData,
                invoice_id: invoiceId,
                user_id: userId
            });
            const newChatId = response.data.chatId;
            setChatId(newChatId);
            setIsChatOpen(true);
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    return (
        <>
            <Card className="h-96 flex flex-col overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-2xl">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4">
                    <p>{ai_analysis}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={createChat}>Chat with AI</Button>
                </CardFooter>
            </Card>

            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>AI Chat</DialogTitle>
                    </DialogHeader>
                    {chatId && (
                        <div className="h-[80vh]">
                            <Chat chat_id={chatId} invoice_data={invoiceData} invoice_id={invoiceId} user_id={userId} />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AIResume;
