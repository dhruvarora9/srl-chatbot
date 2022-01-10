import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { checkRoomStatusUser, sendMessage } from "../../actions/livechatAction";
import LiveChatExpiry from "../LiveChatExpiry/LiveChatExpiry";
import Loader from "../Loader/Loader";

import { useLocation, useParams } from "react-router-dom";
import LiveChatMessageBubble from "../LiveChatMessageBubble/LiveChatMessageBubble";

function LiveChatUser() {
  const mainLiveChatLoading = useSelector((store) => store.livechat.loading);
  const mainLiveChatError = useSelector((store) => store.livechat.error);
  const messagesList = useSelector((store) => store.livechat.messages);
  const roomId = useSelector((state) => state.livechat.roomId);
  const formStatus = useSelector((state) => state.livechat.formStatus);
  const senderEmail = useSelector((state) => state.livechat.senderEmail);

  const dispatch = useDispatch();
  const params = useParams();
  // const dispatch = useDispatch();

  useEffect(() => {
    if (!formStatus) {
      console.log("use effect called");
      let roomId = params.roomId;
      dispatch(checkRoomStatusUser(roomId));
    }
  }, []);

  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string()
      .trim()
      .min(1, "Minimum 1 characters required")
      .required("Please enter valid Message"),
  });

  const sendLivechatHandler = ({ text }, { resetForm, setSubmitting }) => {
    dispatch(sendMessage(roomId, text, senderEmail));
    resetForm();
    setSubmitting(false);
  };

  return (
    <>
      {!mainLiveChatLoading && mainLiveChatError && (
        <div>
          <LiveChatExpiry />
        </div>
      )}
      {!mainLiveChatLoading && !mainLiveChatError && (
        <div className="w-screen h-screen bg-sky-800 pt-20">
          <div className="w-10/12 bg-white p-2 mx-auto h-4/5">
            <div className="h-1/6 ">Navbar</div>
            <div className="h-4/6 py-1 px-2">
              <div className="border-2 h-full rounded-md p-2 flex flex-col">
                {messagesList.map((item) => (
                  <LiveChatMessageBubble
                    key={item.id}
                    id={item.id}
                    children={item.message}
                    sender={item.sender}
                  />
                ))}
              </div>
            </div>
            <div className="h-1/6 my-2">
              <Formik
                initialValues={{ text: "" }}
                validationSchema={validateRequestCallBack}
                onSubmit={sendLivechatHandler}
                validateOnBlur
              >
                {({ errors, touched }) => (
                  <Form className="w-full flex flex-col justify-start">
                    <div className="w-full flex ">
                      <Field name="text" className=" w-4/5 ">
                        {({ field }) => (
                          <input
                            className="w-full py-2 px-1 mx-1"
                            type="text"
                            {...field}
                            placeholder="write your question here..."
                          />
                        )}
                      </Field>
                      <button
                        className="bg-cyan-600 rounded-md text-white w-1/5 disabled:bg-cyan-800 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={errors.text && touched.text}
                      >
                        Send
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
      {mainLiveChatLoading && !mainLiveChatError && <Loader />}
    </>
  );
}

export default LiveChatUser;
