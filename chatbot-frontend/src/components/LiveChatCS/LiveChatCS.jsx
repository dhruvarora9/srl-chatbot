import { off } from "firebase/database";
import React, { useEffect } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { checkRoomStatusCS, sendMessage } from "../../actions/livechatAction";
import LiveChatExpiry from "../LiveChatExpiry/LiveChatExpiry";
import Loader from "../Loader/Loader";

function LiveChatCS() {
  const mainLiveChatLoading = useSelector((store) => store.livechat.loading);
  const mainLiveChatError = useSelector((store) => store.livechat.error);
  const messageList = useSelector((store) => store.livechat.messages);
  const csEmail = useSelector((store) => store.auth.email);
  const unsububscribeRef = React.useRef();
  let { roomId } = useParams();
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkRoomStatusCS(roomId, csEmail, unsububscribeRef));
    return () => {
      unsububscribeRef.current?.();
    };
  }, []);

  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string()
      .trim()
      .min(1, "Minimum 1 characters required")
      .required("Please enter valid Message"),
  });

  const sendLiveChatHandler = ({ text }, { resetForm, setSubmitting }) => {
    dispatch(sendMessage(roomId, text, "customersupport"));
    resetForm();
    setSubmitting(false);
  };

  let page = <Loader />;
  if (!mainLiveChatLoading && mainLiveChatError) {
    page = <LiveChatExpiry />;
  }
  if (
    !mainLiveChatLoading &&
    mainLiveChatError === null &&
    messageList.length > 0
  ) {
    page = (
      <div className="w-screen h-screen bg-sky-800 pt-20">
        <div className="w-10/12 bg-white p-2 mx-auto h-4/5">
          <div className="h-1/6 ">Navbar</div>
          <div className="h-4/6 py-1 px-2">
            <div className="border-2 h-full rounded-md p-2">
              {messageList.map((item) => (
                <p>{item.message}</p>
              ))}
            </div>
          </div>
          <div className="h-1/6 my-2">
            <Formik
              initialValues={{ text: "" }}
              validationSchema={validateRequestCallBack}
              onSubmit={sendLiveChatHandler}
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
    );
  }
  return page;
}

export default LiveChatCS;
