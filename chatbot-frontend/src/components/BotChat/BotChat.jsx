import React from "react";
import { useSelector } from "react-redux";
import BotChatInput from "../BotChatInput/BotChatInput";
import MessageBubble from "../MessageBubble/MessageBubble";
import "./BotChat.css";

export default function BotChat() {
  const messages = useSelector((store) => store.botmessage.messages);
  return (
    <div className="botchat-rootContainer">
      <div className="botchat-chatWindow">
        {messages.map((mesg) => {
          return (
            <MessageBubble
              key={mesg.id}
              id={mesg.id}
              content={mesg.message}
              type={mesg.type}
            />
          );
        })}
      </div>
      <BotChatInput />
    </div>
  );
}
