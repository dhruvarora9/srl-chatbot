import React, { useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

import { createRoomLiveChatUser } from "../../actions/livechatUserAction";
import { useState } from "react";
import { SET_FORM_STATUS } from "../../action-types/actionTypes";

const initialValues = {
  username: "",
  user_mobile_no: "",
  useremail: "",
};

function UserLiveChatForm() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const senderEmail = useSelector((store) => store.livechat.senderEmail);
  const formStatus = useSelector((store) => store.livechat.formStatus);
  const roomId = useSelector((store) => store.livechat.roomId);

  useEffect(() => {
    if (senderEmail && senderEmail !== "") {
      if (roomId) {
        navigate(`/livechatuser/${roomId}`);
      }
    }
    setLoading(false);
  }, []);
  const validatefields = Yup.object().shape({
    username: Yup.string()
      .trim()
      .min(1, "Name cannot be less than 1 character long")
      .max(40, "Name cannot be more than 40 characters long")
      .required("Please enter your Name"),
    user_mobile_no: Yup.string()
      .min(10, "Mobile number must have minimum 10 digits")
      .max(10, "Mobile number must have maximum 10 digits")
      .trim()
      .required("Please enter your Mobile Number")
      .matches("^[0-9]+$", "Mobile number should be numbers"),
    useremail: Yup.string()
      .trim()
      .email("Enter valid Email Id")
      .required("please fill your Email Id"),
  });

  const handleSubmitEvent = (values, actions) => {
    let postdata = {
      username: values.username,
      user_mobile_no: values.user_mobile_no,
      useremail: values.useremail,
    };
    const roomId = uuidv4();

    dispatch(
      createRoomLiveChatUser(
        postdata.username,
        postdata.user_mobile_no,
        postdata.useremail,
        roomId,
        navigate
      )
    );
    dispatch({
      type: SET_FORM_STATUS,
      payload: true,
    });
    sessionStorage.setItem("senderEmail", postdata.useremail);
    sessionStorage.setItem("roomId", roomId);
    sessionStorage.setItem("senderName", postdata.useremail);
    sessionStorage.setItem("senderMobileNo", postdata.user_mobile_no);
    navigate(`/livechatuser/${roomId}`);
  };

  return (
    <>
      {loading && <div>Loading ...</div>}
      {!loading && (
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
                          placeholder="Enter your name *"
                          value={values.username}
                          // onChange={(e) => handleInputChange(e, setFieldValue)}
                          onChange={handleChange}
                          isInvalid={errors.username && touched.username}
                        />
                        {errors.username && touched.username ? (
                          <p className="error no-pos"> {errors.username}</p>
                        ) : null}
                      </Form.Group>
                      <Form.Group controlId="user_mobile_no" className="my-4">
                        <Form.Control
                          type="text"
                          name="user_mobile_no"
                          placeholder="Enter mobile no *"
                          value={values.user_mobile_no}
                          onChange={handleChange}
                          isInvalid={
                            errors.user_mobile_no && touched.user_mobile_no
                          }
                        />
                        {errors.user_mobile_no && touched.user_mobile_no ? (
                          <p className="error no-pos">
                            {" "}
                            {errors.user_mobile_no}
                          </p>
                        ) : null}
                      </Form.Group>
                      <Form.Group controlId="useremail" className="my-4">
                        <Form.Control
                          type="text"
                          name="useremail"
                          placeholder="Enter Email Id *"
                          value={values.useremail}
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
      )}
    </>
  );
}

export default UserLiveChatForm;
