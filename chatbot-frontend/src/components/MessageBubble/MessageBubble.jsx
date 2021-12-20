import React from "react";
import "./MessageBubble.css";

export default function MessageBubble({ id, content, type }) {
  return (
    <div
      key={id}
      className={
        type === "bot"
          ? "messagebubble-rootContainer messagebubble-left"
          : "messagebubble-rootContainer messagebubble-right"
      }
    >
      <span className="messagebubble-content">{content}</span>
    </div>
  );
}
