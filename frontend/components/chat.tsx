"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
};

type ChatProps = {
    chat_id: string;
    image_url: string;
};

const Chat = ({ chat_id, image_url }: ChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const router = useRouter()

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now().toString(),
                text: `You said: "${input}"`,
                sender: "bot",
            };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);

        setInput("");
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="flex flex-row gap-4 mb-4">
                        {/* TODO: Add back to platform and open the invoice */}
                        <Button onClick={() => {router.push("/platform")}}>Back</Button>
                        <Button onClick={() => window.open(image_url, "_blank")}>Open invoice</Button>
                </div>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-3 rounded-lg text-black ${
                            message.sender === "user"
                                ? "self-end"
                                : "bg-gray-200 self-start border"
                        }`}
                    >
                        {message.text}
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
                        className="px-4 py-2 "
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
