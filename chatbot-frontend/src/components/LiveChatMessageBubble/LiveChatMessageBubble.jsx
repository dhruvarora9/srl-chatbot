import React from "react";
import { useSelector } from "react-redux";

function LiveChatMessageBubble({ id, children, sender }) {
  // let photoURL = "https://cdn-icons.flaticon.com/png/512/552/premium/552721.png?token=exp=1641991766~hmac=d97f9b1398e45746f4f495adc33b9971" ;

  let senderEmail = useSelector((store) => store.livechat.senderEmail);
  let customClass =
    sender !== senderEmail
      ? "self-start bg-blue-600 text-white"
      : "self-end  bg-gray-200";

  let msgClass =
    sender !== senderEmail
      ? "self-start flex-row mr-2"
      : "self-end flex-row-reverse ml-2";
  return (
    <div className={`${msgClass} flex `} style={{ maxWidth: "55%" }}>
      <img
        src="https://img.icons8.com/fluency/344/user-male-circle.png"
        alt="Avatar"
        className={`${msgClass} rounded-full `}
        width={45}
        height={45}
      />
      <div
        key={id}
        className={`${customClass}  p-2 rounded-md m-0.5 my-1 font-normal text-base`}
      >
        {children}
      </div>{" "}
    </div>
  );
}

export default LiveChatMessageBubble;
