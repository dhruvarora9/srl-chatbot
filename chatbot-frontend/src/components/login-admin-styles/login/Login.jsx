import React from "react";
// import { Formik, Form as FormikForm } from "formik";
import { Formik, Form as FormikForm } from "formik";
import { Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-toastify";

import "../login/login.styles.css";
import "../styles.css";
import { adminLogin } from "../../../actions/authAction";
import { useNavigate } from "react-router-dom";
// import { logIn } from "../../../actions/signup.action";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const history = useHistory();

  const validateRequestCallBack = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Enter valid Email Id")
      .required("Please enter Email Id"),
    password: Yup.string().trim().required("Please enter Password"),
  });

  const handleSubmitEvent = (values, actions) => {
    let postdata = {
      email: values.email,
      password: values.password,
    };
    console.log("postdata", postdata);
    dispatch(adminLogin(postdata.email, postdata.password, navigate));

    actions.setSubmitting(false);
  };

  //   const handleEmailChange = (e, setFieldValue) => {
  //     e.preventDefault();
  //     let { value, name } = e.target;
  //     setFieldValue(name, value);
  //   };

  return (
    <div className="w-full h-screen pt-48 bg-gray-100">
      <div className="w-4/5 shadow-lg px-4 py-5 rounded-md mx-auto bg-white">
        <span className="text-xl font-semibold ">Log into your Account</span>
        <Formik
          initialValues={initialValues}
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
                <Form.Group controlId="email" className="my-4">
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email Id *"
                    value={values.email}
                    // onChange={(e) => handleEmailChange(e, setFieldValue)}
                    onChange={handleChange}
                    isInvalid={errors.email && touched.email}
                  />
                  {errors.email && touched.email ? (
                    <p className="error no-pos"> {errors.email}</p>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="password" className="my-4">
                  <Form.Control
                    type="password"
                    placeholder="Password *"
                    onChange={handleChange}
                    value={values.password}
                    isInvalid={errors.password && touched.password}
                  />
                  {errors.password && touched.password ? (
                    <p className="error no-pos"> {errors.password}</p>
                  ) : null}
                </Form.Group>
                {errors.message ? (
                  <Row>
                    <Col xs={12} sm={12} md={12}>
                      <span className="errorMsg">{errors.message}</span>
                    </Col>
                  </Row>
                ) : null}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Log In
                </button>
              </FormikForm>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
