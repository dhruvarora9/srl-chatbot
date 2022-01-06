import { off } from "firebase/database";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { checkRoomStatusCS } from "../../actions/livechatAction";
import LiveChatExpiry from "../LiveChatExpiry/LiveChatExpiry";
import Loader from "../Loader/Loader";

function LiveChatCS() {
  const mainLiveChatLoading = useSelector((store) => store.livechat.loading);
  const mainLiveChatError = useSelector((store) => store.livechat.error);
  const unsububscribeRef = React.useRef();
  let { roomId } = useParams();
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      checkRoomStatusCS(roomId, "customersupport1@gmail.com", unsububscribeRef)
    );
    return () => {
      unsububscribeRef.current?.();
    };
  }, []);
  let page = <Loader />;
  if (!mainLiveChatLoading && mainLiveChatError) {
    page = <LiveChatExpiry />;
  }
  if (!mainLiveChatLoading && mainLiveChatError === null) {
    page = (
      <div className="w-screen h-screen bg-sky-800 pt-20">
        <div className="w-10/12 bg-white p-2 mx-auto h-4/5">
          <div className="h-1/6 ">Navbar</div>
          <div className="h-4/6 py-1 px-2">
            <div className="border-2 h-full rounded-md p-2">Window</div>
          </div>
          <div className="h-1/6 my-2">
            <input
              type="text"
              className="border-2 border-gray-700 py-2 px-1 w-9/12"
            />
            <button className="bg-cyan-600 px-2 py-1 w-2/12 mx-0.5 my-1 text-white">
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
  return page;
}

export default LiveChatCS;
