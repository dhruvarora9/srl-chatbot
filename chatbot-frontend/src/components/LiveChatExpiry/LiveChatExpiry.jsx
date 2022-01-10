import React from "react";
import { useSelector } from "react-redux";

function LiveChatExpiry() {
  const error = useSelector((store) => store.livechat.error);
  return (
    <div className="h-full w-full pt-20">
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-red-600">Error</span>
        <span className="font-semibold text-lg">{error}</span>
      </div>
    </div>
  );
}

export default LiveChatExpiry;
