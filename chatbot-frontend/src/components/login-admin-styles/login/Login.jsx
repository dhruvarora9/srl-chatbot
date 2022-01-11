import React from "react";
// import { Formik, Form as FormikForm } from "formik";
import { Formik, Form as FormikForm } from "formik";
import { Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "../login/login.styles.css";
import "../styles.css";
import { adminLogin } from "../../../actions/authAction";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((store) => store.auth.error);
  const authToken = useSelector((store) => store.auth.token);

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
    dispatch(adminLogin(postdata.email, postdata.password));
    actions.setSubmitting(false);
  };

  return (
    <div className="w-full h-screen bg-gray-100 py-4 flex flex-col">
      <Link
        role={"button"}
        to="/"
        className="bg-blue-400  hover:bg-blue-500  ml-auto mr-4 text-white font-bold py-2 px-4 rounded"
      >
        Back to Home
      </Link>
      <div className="w-4/5 shadow-lg mt-40 px-4 py-5 rounded-md mx-auto bg-white">
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
                <div className="flex flex-col">
                  {authError ? (
                    <span className="text-red-600 pb-2">{authError}</span>
                  ) : null}
                  <button
                    className="bg-blue-500 self-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-1/6"
                    type="submit"
                  >
                    Log In
                  </button>
                </div>
              </FormikForm>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
