import React from "react";
import { useSelector } from "react-redux";

function LiveChatMessageBubble({ id, children, sender }) {
  let senderEmail = useSelector((store) => store.livechat.senderEmail);
  let customClass =
    sender !== senderEmail
      ? "self-start bg-blue-600 text-white"
      : "self-end bg-gray-200";
  return (
    <div
      key={id}
      style={{ maxWidth: "55%" }}
      className={`${customClass}  p-2 rounded-md m-0.5 my-1 text-left`}
    >
      <span className="font-normal text-base ">{children}</span>
    </div>
  );
}

export default LiveChatMessageBubble;
