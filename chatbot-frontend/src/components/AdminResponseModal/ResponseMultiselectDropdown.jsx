import React from "react";
import { Formik, Field, Form, useField, useFormikContext } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/app";

function ResponseMultiselectDropdown(props) {
  const [multiOptionData, setMultiOptionData] = useState([]);
  const {
    values: { multiResponse },
    setFieldValue,
  } = useFormikContext();

  const [field, meta] = useField(props);

  let getMultipleOptionData = async () => {
    const q = query(
      collection(db, "botchat"),
      where("valid", "==", true),
      where("type", "==", true)
    );
    let optionList = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      optionList.push({
        id: doc.id,
        reference: `/botchat/${doc.id}`,
        text: doc.data().query,
      });
    });

    setMultiOptionData(optionList);
  };

  let addItemHandler = (selectedList) => {
    setFieldValue("responseList", selectedList);
  };
  let removeItemHandler = (selectedList) => {
    setFieldValue("responseList", selectedList);
  };

  useEffect(() => {
    if (multiResponse) {
      console.log("if condition in if called");
      getMultipleOptionData();
    }
  }, []);

  return (
    <div>
      {multiOptionData && multiOptionData.length === 0 && <p>Loading....</p>}
      {multiOptionData && multiOptionData.length > 0 && (
        <>
          <Multiselect
            {...field}
            options={multiOptionData}
            onSelect={addItemHandler}
            onRemove={removeItemHandler}
            displayValue="text"
          />
          {!!meta.touched && !!meta.error && (
            <span className="text-red-600">{meta.error}</span>
          )}
        </>
      )}
    </div>
  );
}

export default ResponseMultiselectDropdown;
