"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, MessagesSquare } from "lucide-react";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; 
import Chat from '@/components/chat';
import api from "@/services/api";

interface UploadHistoryItem {
    id: string;
    imageUrl: string; 
    aiAnalysis: string;
    invoiceData: string;
    createdAt: string;
}

interface UploadsHistoryProps {
    history: UploadHistoryItem[];
}

type ChatProps = {
    chatId: string;
    invoiceData: string;
    invoiceId: string;
    userId: string;
};

type Message = {
    id: string;
    UserMessage?: string;
    AiMessage?: string;
  };

const UploadsHistory: React.FC<UploadsHistoryProps> = ({ history }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [chatData, setChatData] = useState<ChatProps | null>(null);

    const fetchChatData = async (item: UploadHistoryItem) => {
        try {
            const response = await api.get(`/chat/${item.id}/chat`);
            setChatMessages(response.data.chat.message || []);
            setChatData({
                chatId: response.data.chat.id,
                invoiceId: response.data.chat.invoiceId,
                userId: response.data.chat.userId,
                invoiceData: item.invoiceData,
            });
            setIsChatOpen(true);
        } catch (error) {
            toast.error("Failed to fetch chat");
            console.error("Error fetching chat:", error);
        }
    };

    const fetchChatMessages = async (item: UploadHistoryItem) => {
        try {
            const response = await api.get(`/chat/${item.id}/chat`);
            setChatMessages(response.data.chat.message || []);
        } catch (error) {
            toast.error("Failed to fetch chat messages");
            console.error("Error fetching chat messages:", error);
        }
    };

    const generatePdf = async (item: UploadHistoryItem) => {
        try {
            const pdf = new jsPDF({ unit: "mm", format: "a4" });
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = item.imageUrl;
    
            // Gera o PDF somente após o carregamento da imagem
            img.onload = () => {
                const maxWidth = 190;
                const imgWidth = Math.min(img.width * (maxWidth / img.width), maxWidth);
                const imgHeight = img.height * (imgWidth / img.width);
    
                // Página 1: Imagem
                pdf.addImage(img, "JPEG", 10, 10, imgWidth, imgHeight);
    
                // Página 2: Análise da IA
                pdf.addPage();
                pdf.setFont("times", "normal");
                pdf.setFontSize(11);
                pdf.text("AI Analysis:", 10, 10);
    
                const analysisText = item.aiAnalysis || "No analysis provided.";
                const lines = pdf.splitTextToSize(analysisText, 190);
                pdf.text(lines, 10, 20);
    
                pdf.text("Created At:", 10, 280);
                pdf.text(new Date(item.createdAt).toLocaleString("pt-BR"), 10, 290);
    
                // Página 3: Mensagens do Chat
                pdf.addPage();
                pdf.text("Chat Messages:", 10, 10);
                let yOffset = 20;
    
                chatMessages.forEach((message) => {
                    const userMessageLines = pdf.splitTextToSize(`User: ${message.UserMessage}`, 190);
                    pdf.text(userMessageLines, 10, yOffset);
                    yOffset += userMessageLines.length * 4 + 3;
    
                    if (yOffset > 280) {
                        pdf.addPage();
                        yOffset = 20;
                    }
    
                    const aiMessageLines = pdf.splitTextToSize(`AI: ${message.AiMessage}`, 190);
                    pdf.text(aiMessageLines, 10, yOffset);
                    yOffset += aiMessageLines.length * 4 + 3;
    
                    if (yOffset > 280) {
                        pdf.addPage();
                        yOffset = 20;
                    }
                });
    
                // Salvar o PDF
                pdf.save(`invoice-${item.id}.pdf`);
            };
    
            img.onerror = () => {
                toast.error("Error generating PDF");
            };
        } catch (error) {
            toast.error("Error generating PDF");
            console.error("Error generating PDF:", error);
        }
    };
    

    return (
        <>
            <div className="m-6">
                <h2 className="text-xl font-semibold my-4">History</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>AI analysis</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                                        Open Image
                                    </a>
                                </TableCell>
                                <TableCell>{item.aiAnalysis}</TableCell>
                                <TableCell>
                                    {new Date(item.createdAt).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </TableCell>
                                <TableCell className="flex justify-center gap-2">
                                    <Download
                                        onClick={async () => {
                                            await fetchChatMessages(item)
                                            await generatePdf(item)
                                        }}
                                        className="cursor-pointer"
                                    />
                                    <MessagesSquare
                                        onClick={() => fetchChatData(item)}
                                        className="cursor-pointer"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>AI Chat</DialogTitle>
                    </DialogHeader>
                    {chatData && (
                        <div className="h-[80vh]">
                            <Chat
                                chat_id={chatData.chatId}
                                invoice_data={chatData.invoiceData}
                                invoice_id={chatData.invoiceId}
                                user_id={chatData.userId}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UploadsHistory;

