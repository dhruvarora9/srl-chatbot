import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoomLiveChatUser,
  sendMessage,
} from "../../actions/livechatAction";

import Loader from "../Loader/Loader";

function LiveChatUser() {
  const mainLiveChatLoading = useSelector((store) => store.livechat.loading);
  const mainLiveChatError = useSelector((store) => store.livechat.error);
  const messagesList = useSelector((store) => store.livechat.messages);
  const roomId = useSelector((state) => state.livechat.roomId);
  const dispatch = useDispatch();
  // const dispatch = useDispatch();

  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string()
      .trim()
      .min(1, "Minimum 1 characters required")
      .required("Please enter valid Message"),
  });

  const sendLivechatHandler = ({ text }, { resetForm, setSubmitting }) => {
    dispatch(sendMessage(roomId, text, "user"));
    resetForm();
    setSubmitting(false);
  };

  return (
    <>
      {!mainLiveChatLoading && !mainLiveChatError && (
        <div className="w-screen h-screen bg-sky-800 pt-20">
          <div className="w-10/12 bg-white p-2 mx-auto h-4/5">
            <div className="h-1/6 ">Navbar</div>
            <div className="h-4/6 py-1 px-2">
              <div className="border-2 h-full rounded-md p-2">
                {messagesList.map((item) => (
                  <p>{item.message}</p>
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