import React from "react";
import "./MessageBubble.css";

export default function MessageBubble({ id, content, sender }) {
  return (
    <div
      key={id}
      className={
        sender === "user"
          ? "messagebubble-rootContainer messagebubble-right"
          : "messagebubble-rootContainer messagebubble-left"
      }
    >
      <span className="messagebubble-content">{content}</span>
    </div>
  );
}
