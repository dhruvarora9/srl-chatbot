import React from "react";
import { Formik, Form as FormikForm } from "formik";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

import { createRoomLiveChatUser } from "../../actions/livechatAction";

const initialValues = {
  username: "",
  useremail: "",
};

function UserLiveChatForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validatefields = Yup.object().shape({
    username: Yup.string().trim().required("please enter your name"),
    useremail: Yup.string()
      .trim()
      .email("please enter valid useremail id")
      .required("please fill your useremail id"),
  });

  const handleSubmitEvent = (values, actions) => {
    let postdata = {
      username: values.username,
      useremail: values.useremail,
    };
    const roomId = uuidv4();
    dispatch(
      createRoomLiveChatUser(postdata.username, postdata.useremail, roomId)
    );
    navigate(`/livechatuser/${roomId}`);
  };

  return (
    <div className="w-screen h-screen bg-sky-500 pt-20">
      <div className="w-10/12 bg-white p-2 mx-auto h-4/5">
        <div className="h-1/6 ">
          <Link
            role={"button"}
            to="/"
            className="bg-blue-400  hover:bg-blue-500  ml-auto mr-4 text-white font-bold py-2 px-4 rounded"
          >
            Back to Home
          </Link>
        </div>
        <div className="h-4/6 py-1 px-2  ">
          <Formik
            initialValues={initialValues}
            validationSchema={validatefields}
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
                  <Form.Group controlId="username" className="my-4">
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="username *"
                      value={values.username}
                      // onChange={(e) => handleuserEmailChange(e, setFieldValue)}
                      onChange={handleChange}
                      isInvalid={errors.username && touched.username}
                    />
                    {errors.username && touched.username ? (
                      <p className="error no-pos"> {errors.username}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group controlId="useremail" className="my-4">
                    <Form.Control
                      type="text"
                      name="useremail"
                      placeholder="userEmail Id *"
                      value={values.useremail}
                      // onChange={(e) => handleuserEmailChange(e, setFieldValue)}
                      onChange={handleChange}
                      isInvalid={errors.useremail && touched.useremail}
                    />
                    {errors.useremail && touched.useremail ? (
                      <p className="error no-pos"> {errors.useremail}</p>
                    ) : null}
                  </Form.Group>
                  <div className="flex flex-col">
                    <button
                      className="bg-blue-500 self-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-1/6"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </FormikForm>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default UserLiveChatForm;
