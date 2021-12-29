import React from "react";
import { Formik, Field, Form } from "formik";

function AdminViewModal({ show, data, onHide }) {
  return (
    <div className=" absolute  h-screen w-screen inset-0 z-20">
      <div
        onClick={onHide}
        className="absolute inset-0 h-full w-full bg opacity-70 bg-slate-700"
      ></div>
      <div className="mx-auto p-6 w-3/5 flex flex-col bg-white opacity-100 rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between">
          <span className="text-xl font-bold">View Response</span>
          <button
            onClick={onHide}
            className="rounded-full  bg-red-700 text-white  px-2"
          >
            X
          </button>
        </div>

        <div className="flex-col">
          <Formik
            initialValues={{
              text: "query",
              response: "response ",
            }}
          >
            {({ isSubmitting, values, errors, touched, setFieldValue }) => (
              <Form className="flex flex-col  p-5 mt-4 space-y-4 text-black bg-white rounded-lg  lg:p-10 lg:space-y-6">
                <label className="block">
                  <span className="flex text-lg font-medium text-gray-700">
                    Response
                  </span>
                </label>
                {values.response && (
                  <>
                    <Field name="response">
                      {({ field }) => (
                        <div className="mt-3">
                          <ol className="list-decimal "  {...field} rows="6">
                            {Array.isArray(data.response) &&
                              data.response.map((item, ind) => {
                                return (
                                  <li className="flex-col text-justify" key={ind}>
                                    {" "}
                                    {item.query}{" "}
                                  </li>
                                );
                              })}{" "}
                            {typeof data.response === "string" && (
                              <li className="flex-col text-justify">{data.response}</li>
                            )}
                          </ol>
                        </div>
                      )}
                    </Field>
                    {errors.response && touched.response ? (
                      <div className="text-red-600">{errors.response}</div>
                    ) : null}
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
export default AdminViewModal;
