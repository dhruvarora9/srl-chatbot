import React from "react";
import { Formik, Form as FormikForm } from "formik";
import { Row, Col, Button, Form, Modal, FloatingLabel } from "react-bootstrap";
import * as Yup from "yup";

export default function AdminResponseModal() {
  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string().trim().required("Please enter valid Question"),
    response: Yup.string().trim().required("Please enter a valid Response"),
  });
  const handleSubmitEvent = (values, actions) => {
    let post_data = {
      text: values.text,
      response: values.response,
    };
    console.log(post_data);
  };

  return (
    <div className="absolute h-screen w-screen inset-0 ">
      <div className="w-3/6 flex flex-col">
        <span>Add a Response</span>
        <div className="flex-col">
          <Formik
            initialValues={{ text: "", response: "" }}
            validationSchema={validateRequestCallBack}
            onSubmit={handleSubmitEvent}
          >
            {({
              values,
              errors,
              handleChange,
              isSubmitting,
              setFieldValue,
              touched,
            }) => {
              return (
                <FormikForm>
                  <Form.Group controlId="text" className="my-2">
                    <Form.Control
                      type="textarea"
                      placeholder="Enter Question *"
                      // onChange={handleChange}
                      value={values.text}
                      isInvalid={errors.text && touched.text}
                    />
                    {errors.text && touched.text ? (
                      <p className="error no-pos"> {errors.text}</p>
                    ) : null}
                  </Form.Group>
                  <FloatingLabel
                    controlId="response"
                    className="my-2"
                    label="Enter your Response * ( Max Character Limit: 200 )"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      onChange={handleChange}
                      maxLength={200}
                      style={{ height: "100px", resize: "none" }}
                      value={values.response}
                      isInvalid={errors.response && touched.response}
                    />
                    {errors.response && touched.response ? (
                      <p className="error no-pos"> {errors.response}</p>
                    ) : null}
                  </FloatingLabel>

                  {errors.message ? (
                    <div className="w-full p-2">
                      <span className="errorMsg">{errors.message}</span>
                    </div>
                  ) : null}
                  <button
                    variant="primary"
                    className="btn btn-info d-grid gap-2 col-6 mx-auto my-3"
                    style={{ color: "white" }}
                    type="submit"
                  >
                    Save
                  </button>
                </FormikForm>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
