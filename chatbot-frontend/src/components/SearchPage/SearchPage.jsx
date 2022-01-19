import React from "react";
import { Form, Field, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getSearchData } from "../../actions/searchAction";
import SearchDetails from "./SearchDetails";
import { useState } from "react";
import { useEffect } from "react";

const initialValues = {
  value: "",
};

function SearchPage() {
  const { searchedValue } = useSelector((store) => store.searchpage);
  const { searchedReasult } = useSelector((store) => store.searchpage);
  console.log("searchedValue", searchedValue);
  console.log("searchedReasult", searchedReasult);
  const [inputData, setInputData] = useState('')
  const dispatch = useDispatch();

  const validatefieldData = Yup.object().shape({
    value: Yup.string()
      .trim()
      .min(2, "Minimum 2 characters required")
      .required("Please enter valid Message"),
  });

  const SearchSubmithandler = ({ value }, { setSubmitting }) => {
    localStorage.setItem("value", value)
    console.log("search value ", value);
    setInputData(value);
    dispatch(getSearchData(value));
    setSubmitting(false);
  };

  const handleChange = (e, setFieldValue) => {
    e.preventDefault();
    let { value, name } = e.target;
    console.log('value', value);
    setFieldValue(name, value);
  }
  console.log('inputData',inputData)

  const newInitialValues = Object.assign(initialValues, {
    value: inputData ? inputData : "",
  });
 
  useEffect(() => {
    setInputData(localStorage.getItem("value"))
  })

  return (
    <div className=" box-content h-screen w-800 bg-sky-500 p-4 border-4 items-center ">
      <div className="border-2 inline bg-gray-200 rounded-md p-2 flex flex-col">
        <div className="h-1/6 my-2 ">
          <Formik
            initialValues={newInitialValues}
            validationSchema={validatefieldData}
            onSubmit={SearchSubmithandler}
            validateOnBlur
          >
            {({ errors, setFieldValue, touched }) => (
              <Form className="w-full flex flex-col justify-start">
                <div className="w-full flex ">
                  <Field name="value" className=" w-4/5 ">
                    {({ field }) => (
                      <input
                        className="w-full py-2 px-1 mx-1"
                        type="text"
                        placeholder="write something here..."
                        {...field}
                        onChange={(e)=> {handleChange(e, setFieldValue)}}
                      />
                     )} 
                  </Field>
                  <button
                    className="bg-cyan-600 rounded-md text-white w-1/5 disabled:bg-cyan-800 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={errors.text && touched.text}
                  >
                    Search
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>{" "}
      <br />
      <br />
      {searchedReasult ? (
        <SearchDetails searchedReasult={searchedReasult} />
      ) : null}
    </div>
  );
}
export default SearchPage;
