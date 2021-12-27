import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Multiselect } from "multiselect-react-dropdown";

export default function AdminResponseModal({ show, id, onHide }) {
  const [responseType, setResponseType] = useState("single");
  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string().trim().required("Please enter valid Question"),
    response: Yup.string().trim().required("Please enter a valid Response"),
  });

  const handleSubmitEvent = ({ text, response, multiResponse }, actions) => {
    let post_data = {
      text,
      response,
    };
    console.log(post_data);
  };

  return (
    <div className=" absolute  h-screen w-screen inset-0 z-20">
      <div
        onClick={onHide}
        className="absolute inset-0 h-full w-full bg opacity-70 bg-slate-700"
      ></div>
      <div className="mx-auto p-6  flex flex-col bg-white opacity-100 rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="text-xl font-bold">Add a Response</span>
        <div className="flex-col">
          <Formik
            initialValues={{
              text: "query",
              response: "response",
              multiResponse: false,
            }}
            validationSchema={validateRequestCallBack}
            onSubmit={handleSubmitEvent}
          >
            {({ isSubmitting, values, errors, touched, setFieldValue }) => (
              <Form>
                <Field name="text">
                  {({ field }) => (
                    <div>
                      <input type="text" {...field} placeholder="Query" />
                    </div>
                  )}
                </Field>
                {errors.text && touched.text ? <div>{errors.text}</div> : null}
                <label>
                  <Field type="checkbox" name="multiResponse" />
                  Check for multi Response
                </label>
                <Field name="response">
                  {({ field }) => (
                    <div>
                      <input
                        type="text"
                        {...field}
                        placeholder="Add your Response"
                      />
                    </div>
                  )}
                </Field>

                <button type="submit">Submit</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
