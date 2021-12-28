import React from "react";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Multiselect } from "multiselect-react-dropdown";

import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../firebase/app";
import ResponseMultiselectDropdown from "./ResponseMultiselectDropdown";

export default function AdminResponseModal({ show, data, onHide }) {
  const [multiOptionData, setMultiOptionData] = useState([]);

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
      <div className="mx-auto p-6 w-3/5 flex flex-col bg-white opacity-100 rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between">
          <span className="text-xl font-bold">Add a Response</span>
          <button
            onClick={onHide}
            className="rounded-full bg-red-700 text-white  px-2"
          >
            X
          </button>
        </div>

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
              <Form className="flex flex-col  p-5 mt-4 space-y-4 text-black bg-white rounded-lg  lg:p-10 lg:space-y-6">
                <Field name="text">
                  {({ field }) => (
                    <div>
                      <input
                        className="px-2 py-1 border-2 w-full"
                        type="text"
                        {...field}
                        placeholder="Query"
                        value={data.query}
                      />
                    </div>
                  )}
                </Field>
                {errors.text && touched.text ? (
                  <div className="text-red-600">{errors.text}</div>
                ) : null}
                <label className="w-4/6 mx-auto">
                  <Field type="checkbox" name="multiResponse" className="" />{" "}
                  Check for multi Response
                </label>
                {!values.multiResponse && (
                  <>
                    <Field name="response">
                      {({ field }) => (
                        <div className="mt-3">
                          <textarea
                            rows="6"
                            className="resize-none w-full border-2 "
                            {...field}
                            placeholder="Add your Response"
                          ></textarea>
                        </div>
                      )}
                    </Field>
                    {errors.response && touched.response ? (
                      <div className="text-red-600">{errors.response}</div>
                    ) : null}
                  </>
                )}
                {values.multiResponse && (
                  <ResponseMultiselectDropdown data={data} />
                )}

                <button
                  type="submit"
                  className="bg-blue-500 self-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  "
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
