"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { Loader2 } from "lucide-react";

type Message = {
  id: string;
  UserMessage?: string;
  AiMessage?: string;
};

type ChatProps = {
  chat_id: string;
  invoice_data: string;
  invoice_id: string;
  user_id: string;
};

const Chat = ({ chat_id, invoice_data, invoice_id, user_id }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${chat_id}/messages`);
        if (response) {
          setMessages(response.data.messages || []);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chat_id]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { id: Date.now().toString(), UserMessage: input };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true)
  
    try {
      const response = await api.post("/chat/ask", {
        chat_id: chat_id,
        user_input: input,
        invoice_data: invoice_data,
        invoice_id: invoice_id,
        user_id: user_id,
      });

      setInput(""); 
  
      if (response && response.data.AiMessage) {
        const botMessage = {
          id: Date.now().toString(),
          AiMessage: response.data.AiMessage,
        };
  
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Error: No AiMessage in response data", response);
      }
    } catch (error) {
        console.error("Error sending message:", error);
    } finally {
        setIsLoading(false)
    }
  };
  

  return (
    <div className="flex flex-col min-h-full max-h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 ${
              message.UserMessage ? "self-end" : "self-start"
            }`}
          >
            {message.UserMessage && (
              <div className="font-semibold text-black">User: {message.UserMessage}</div>
            )}
            {message.AiMessage && (
              <div className="text-gray-800">{message.AiMessage}</div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
            <Input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    handleSendMessage();
                    }
                }}
            />
            <Button
                onClick={handleSendMessage}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="justify-center items-center h-4 w-4 animate-spin" />
                ) : (
                    "Send"
                )}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
