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
      .min(1, "Minimum 1 characters required")
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
  );
}
