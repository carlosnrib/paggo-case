import Chat from '@/components/chat';

const ChatPage = ({ params }: { params: { chatId: string } }) => {
    return (
        <div className='h-screen'>
            <Chat chat_id={params.chatId} image_url='@/public/logo.png'/>
        </div>
    );
};

export default ChatPage;