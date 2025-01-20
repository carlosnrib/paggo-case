"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AIResumeProps {
    chat_id: string;
    ai_analysis: string;
}

const AIResume: React.FC<AIResumeProps> = ({ ai_analysis, chat_id }) => {
    const router = useRouter()

    return (
        <Card className="h-96 flex flex-col overflow-hidden">
            <CardHeader>
                <CardTitle className='text-2xl '>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4">
                <p>{ai_analysis}</p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => {router.push(`/chat/${chat_id}`)}}>Chat with AI</Button>
            </CardFooter>
        </Card>
    );
};

export default AIResume;