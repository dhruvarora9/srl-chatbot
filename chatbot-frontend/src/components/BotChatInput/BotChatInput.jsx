import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Get_Bot_Message } from "../../actions/botchatAction";
import "./BotChatInput.css";

export default function BotChatInput() {
  const [message, setmessage] = useState("");
  const botMessageList = useSelector((store) => store.botmessage.messages);
  const dispatch = useDispatch();
  const sendBotMessageHandler = () => {
    dispatch(Get_Bot_Message(message, botMessageList));
    setmessage("");
  };
  return (
    <div className="botchatinput-rootContainer">
      <div className="botchatinput-mainContainer">
        <input
          className="botchatinput-inputField"
          type="text"
          value={message}
          placeholder="write your text here"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendBotMessageHandler();
          }}
          onChange={(e) => setmessage(e.target.value)}
        />
        <Button
          className="botchatinput-sendButton"
          onClick={sendBotMessageHandler}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
