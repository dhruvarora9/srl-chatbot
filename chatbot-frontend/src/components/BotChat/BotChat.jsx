import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatBubbleMessage } from "../../actions/botchatAction";
import BotChatInput from "../BotChatInput/BotChatInput";
import MessageBubble from "../MessageBubble/MessageBubble";
import "./BotChat.css";

export default function BotChat() {
  const messages = useSelector((store) => store.botmessage.messages);
  const dispatch = useDispatch();
  const divRef = useRef(null);

  const optionClickHandler = (ques, messId, referenceId) => {
    //reference id == firebase_id for the bubble element
    dispatch(getChatBubbleMessage(divRef, referenceId, ques, messages, messId));
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
                      className="p-2 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-3xl focus:shadow-outline hover:bg-indigo-500 hover:text-indigo-100 disabled:bg-gray-300 disabled:text-gray-600"
                      key={quesBubble.id}
                      disabled={mesg.flag !== undefined && mesg.flag === true}
                      onClick={() => {
                        if (mesg.flag !== undefined && mesg.flag === false)
                          optionClickHandler(
                            quesBubble.message,
                            mesg.id,
                            quesBubble.firebase_id
                          );
                      }}
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
        <div className="h-10 my-3" ref={divRef}></div>
      </div>
      <BotChatInput divRef={divRef} />
    </div>
  );
}
