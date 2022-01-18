import React from "react";
import { useField, useFormikContext } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/app";
import { v4 as uuidv4 } from "uuid";
import { toLowerCaseConverter } from "../../shared/Helper";

function MultiResponseAdd(props) {
  const [textField, setTextField] = useState("");
  const {
    values: { choice, multiResponseList, response },
    setFieldValue,
  } = useFormikContext();

  const [field, meta] = useField(props);

  const addResponseHandler = () => {
    let newMultiResponseList = [
      ...multiResponseList,
      { id: uuidv4(), response: toLowerCaseConverter(textField) },
    ];
    setFieldValue("multiResponseList", newMultiResponseList);
    setFieldValue("response", "");
  };
  const removeResponseHandler = (id) => {
    let newMultiResponseList = multiResponseList.filter(
      (item) => item.id !== id
    );
    setFieldValue("multiResponseList", newMultiResponseList);
  };

  return (
    <>
      <div className="flex flex-col mx-auto">
        <div className="flex ">
          {" "}
          <input
            className="border-2 border-gray-600 rounded-md px-2 py-1"
            onChange={(e) => setTextField(e.target.value)}
          />
          <button
            className="disabled:bg-gray-600 disabled:cursor-not-allowed p-2 bg-teal-600 rounded-md text-white mx-1 "
            type="button"
            onClick={addResponseHandler}
            disabled={textField.trim() === ""}
          >
            Add
          </button>
        </div>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
      <div
        style={{ maxHeight: "8rem" }}
        className="border-t-2 border-t-gray-600 p-2 mt-3 overflow-y-scroll "
      >
        {multiResponseList &&
          multiResponseList.length > 0 &&
          multiResponseList.map((response) => {
            return (
              <div key={response.id} className="flex justify-between py-1">
                <span className="py-1 ">{response.response}</span>
                <button
                  className="px-2 py-1 bg-teal-600 rounded-md text-white "
                  type="button"
                  onClick={() => removeResponseHandler(response.id)}
                >
                  Remove
                </button>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default MultiResponseAdd;
