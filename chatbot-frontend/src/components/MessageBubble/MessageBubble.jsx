import React from "react";
import "./MessageBubble.css";

export default function MessageBubble({ id, children, sender, category }) {
  return (
    <div
      key={id}
      className={
        sender === "user"
          ? "messagebubble-rootContainer messagebubble-right"
          : category === "multiple"
          ? "bg-transparent py-2 messagebubble-left"
          : "messagebubble-rootContainer messagebubble-left"
      }
    >
      <span className="messagebubble-content">{children}</span>
    </div>
  );
}
