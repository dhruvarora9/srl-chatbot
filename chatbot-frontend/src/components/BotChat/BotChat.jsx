import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Get_Bot_Message } from "../../actions/botchatAction";
import BotChatInput from "../BotChatInput/BotChatInput";
import MessageBubble from "../MessageBubble/MessageBubble";
import "./BotChat.css";

export default function BotChat() {
  const messages = useSelector((store) => store.botmessage.messages);
  const dispatch = useDispatch();

  const optionClickHandler = (id, ques) => {
    dispatch(Get_Bot_Message(ques, messages));
  };

  return (
    <div className="botchat-rootContainer">
      <div className="botchat-chatWindow">
        {messages.map((mesg) => {
          if (Array.isArray(mesg.message)) {
            return (
              <MessageBubble
                key={mesg.id}
                id={mesg.id}
                sender={mesg.sender}
                category="multiple"
              >
                <div className="flex justify-between p-1 flex-wrap">
                  {mesg.message.map((quesBubble) => (
                    <button
                      className="  p-2 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-3xl focus:shadow-outline hover:bg-indigo-500 hover:text-indigo-100"
                      key={quesBubble.id}
                      onClick={() =>
                        optionClickHandler(quesBubble.id, quesBubble.message)
                      }
                    >
                      {quesBubble.message}
                    </button>
                  ))}
                </div>
              </MessageBubble>
            );
          }
          return (
            <MessageBubble
              key={mesg.id}
              id={mesg.id}
              content={mesg.message}
              sender={mesg.sender}
            >
              {mesg.message}
            </MessageBubble>
          );
        })}
      </div>
      <BotChatInput />
    </div>
  );
}
