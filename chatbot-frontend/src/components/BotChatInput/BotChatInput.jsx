import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Get_Bot_Message } from "../../actions/botchatAction";
import "./BotChatInput.css";

export default function BotChatInput({ divRef }) {
  const botMessageList = useSelector((store) => store.botmessage.messages);
  const dispatch = useDispatch();
  const sendBotMessageHandler = ({ text }, { resetForm, setSubmitting }) => {
    dispatch(Get_Bot_Message(divRef, text, botMessageList));
    resetForm();
    setSubmitting(false);
  };
  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string()
      .trim()
      .min(2, "Minimum 2 characters required")
      .required("Please enter valid Message"),
  });

  return (
    <div className="botchatinput-rootContainer">
      <div className="botchatinput-mainContainer">
        <Formik
          initialValues={{ text: "" }}
          validationSchema={validateRequestCallBack}
          onSubmit={sendBotMessageHandler}
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
                      placeholder="write your text here"
                    />
                  )}
                </Field>
                <button
                  className="bg-cyan-600 rounded-md text-white w-1/5"
                  type="submit"
                >
                  Send
                </button>
              </div>
              {errors.text && touched.text ? (
                <span className="text-red-500 px-1 text-left">
                  {errors.text}
                </span>
              ) : null}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
