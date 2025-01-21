import Chat from '@/components/chat';
import { FC } from 'react';

const ChatPage: FC<{ params: { chatId: string } }> = async ({ params }) => {
    const { chatId } = await params;

    return (
        <div className='h-screen'>
            {/* <Chat chat_id={chatId} image_url='@/public/logo.png'/> */}
        </div>
    );
};

export default ChatPage;