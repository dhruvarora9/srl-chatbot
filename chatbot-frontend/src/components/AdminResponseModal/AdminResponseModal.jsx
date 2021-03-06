import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
// import { Multiselect } from "multiselect-react-dropdown";
import ResponseMultiselectDropdown from "./ResponseMultiselectDropdown";
import { useDispatch } from "react-redux";
import { submitResponseForValidQuestion } from "../../actions/adminAction";
import MultiResponseAdd from "./MultiResponseAdd";

export default function AdminResponseModal({ show, data, onHide }) {
  // const [multiOptionData, setMultiOptionData] = useState([]);
  const dispatch = useDispatch();

  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string().trim().required("Please enter valid Question"),
    choice: Yup.string(),
    response: Yup.string().when("choice", {
      is: (choice) => ["singleresponse"].includes(choice),
      then: Yup.string().trim().required("Please enter a valid Response"),
    }),

    multiResponseList: Yup.array().when("choice", {
      is: (choice) => ["multiresponse"].includes(choice),
      then: Yup.array().min(2, "Select atleast two options"),
    }),
    responseList: Yup.array().when("choice", {
      is: (choice) => ["multiresponsebubble"].includes(choice),
      then: Yup.array().min(2, "Select atleast two options"),
    }),
  });

  const handleSubmitEvent = (
    { text, response, choice, multiResponseList, responseList },
    actions
  ) => {
    let post_data = {
      text,
      response,
      choice,
      multiResponseList,
      responseList,
    };
    console.log(post_data);
    dispatch(
      submitResponseForValidQuestion(
        data.firebase_id,
        response,
        responseList,
        multiResponseList,
        choice
      )
    );
    onHide();
  };

  return (
    <div className=" absolute  h-screen w-screen inset-0 z-20">
      <div
        onClick={onHide}
        className="absolute inset-0 h-full w-full bg opacity-70 bg-slate-700"
      ></div>
      <div className="mx-auto p-3 md:p-6 w-5/6 md:w-3/5 flex flex-col bg-white opacity-100 rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between">
          <span className="text-xl font-bold">Add a Response</span>
          <button
            onClick={onHide}
            className="rounded-full bg-red-700 text-white px-2"
          >
            X
          </button>
        </div>
        <div className="flex-col">
          <Formik
            initialValues={{
              text: "query",
              response: "",
              multiResponseField: "",
              choice: "singleresponse",
              responseList: [],
              multiResponseList: [],
            }}
            validationSchema={validateRequestCallBack}
            onSubmit={handleSubmitEvent}
          >
            {({ isSubmitting, values, errors, touched, setFieldValue }) => (
              <Form className="flex flex-col p-2  md:p-5 mt-4 space-y-4 text-black bg-white rounded-lg  lg:p-10 lg:space-y-6">
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
                <Field name="choice">
                  {({ field }) => (
                    <div className="flex justify-between">
                      <div>
                        <input
                          {...field}
                          id="singleresponse"
                          value="singleresponse"
                          checked={field.value === "singleresponse"}
                          name="singleresponse"
                          onChange={() =>
                            setFieldValue("choice", "singleresponse")
                          }
                          type="radio"
                        />
                        <label htmlFor="singleresponse">Single Response</label>
                      </div>
                      <div>
                        <input
                          {...field}
                          id="multiresponse"
                          value="multiresponse"
                          checked={field.value === "multiresponse"}
                          name="multiresponse"
                          onChange={() =>
                            setFieldValue("choice", "multiresponse")
                          }
                          type="radio"
                        />
                        <label htmlFor="multiresponse">Multi Response</label>
                      </div>{" "}
                      <div>
                        <input
                          {...field}
                          id="multiresponsebubble"
                          value="multiresponsebubble"
                          checked={field.value === "multiresponsebubble"}
                          name="multiresponsebubble"
                          onChange={() =>
                            setFieldValue("choice", "multiresponsebubble")
                          }
                          type="radio"
                        />
                        <label htmlFor="multiresponsebubble">
                          Multi Bubble Response
                        </label>
                      </div>
                    </div>
                  )}
                </Field>

                {values.choice === "singleresponse" && (
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
                {values.choice === "multiresponse" && (
                  <MultiResponseAdd name="multiResponseList" />
                )}
                {values.choice === "multiresponsebubble" && (
                  <ResponseMultiselectDropdown
                    data={data}
                    name="responseList"
                  />
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
