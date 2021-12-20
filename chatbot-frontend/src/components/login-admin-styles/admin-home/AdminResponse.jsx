import React from "react";
import { Formik, Form as FormikForm } from "formik";
import { Row, Col, Button, Form, Modal, FloatingLabel } from "react-bootstrap";
import * as Yup from "yup";
import { useSelector } from "react-redux";

import "../styles.css";
import "../admin-home/AdminModal.styles.css";

const initialValues = {
  text: "",
  response: "",
};

const AdminResponse = ({ show, onHide, id }) => {
  const unansweredData = [
    {
      id: 1,
      text: "Hello",
    },
    {
      id: 2,
      text: "Hello",
    },
    {
      id: 3,
      text: "Hello",
    },
  ];

  const currentData = unansweredData.find((item) => item.id === id);
  console.log("currentData", currentData.text);

  const validateRequestCallBack = Yup.object().shape({
    text: Yup.string().trim().required("Please enter valid Question"),
    response: Yup.string().trim().required("Please enter a valid Response"),
  });

  const newInitialValues = Object.assign(initialValues, {
    text:
      currentData && Object.keys(currentData).length > 0
        ? currentData.text
        : "",
  });

  const handleSubmitEvent = (values, actions) => {
    let post_data = {
      id:
        currentData && Object.keys(currentData).length > 0
          ? currentData.id
          : "",
      text: values.text,
      response: values.response,
    };
    console.log(post_data);
  };

  return (
    <Modal
      className="requestCallModal"
      show={show}
      onHide={() => onHide(false)}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Response</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row>
            <Col xs={12} md={12}>
              <Formik
                initialValues={newInitialValues}
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
                        <Row>
                          <Col xs={12} sm={12} md={12}>
                            <span className="errorMsg">{errors.message}</span>
                          </Col>
                        </Row>
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
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AdminResponse;
