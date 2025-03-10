import {Button} from "antd";

import ChatList from './features/ChatList';
import ChatInput from "./features/ChatInput";


const ChatConversation = () => {

    return (
        <>
            <ChatList />
            <Button type="primary">Primary Button</Button>
            <ChatInput />
        </>
    );
};

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation;
