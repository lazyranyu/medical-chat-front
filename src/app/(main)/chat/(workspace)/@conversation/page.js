'use client'
import {Button} from "antd";

import ChatList from './features/ChatList';
import ChatInput from "./features/ChatInput";
import {chatService} from "@/api/chatService";



const ChatConversation = () => {
    function sayHello(medical) {
        chatService.hello(medical).then(res=>{
            console.log(res)
        })
    }
    return (
        <>
            <ChatList />
            <ChatInput />
        </>
    );
};

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation;
