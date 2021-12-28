import React from "react";
import { Formik, Field, Form, useField, useFormikContext } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/app";

function ResponseMultiselectDropdown() {
  const [multiOptionData, setMultiOptionData] = useState([]);
  const {
    values: { multiResponse },
  } = useFormikContext();

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
        name: doc.data().query,
      });
    });

    setMultiOptionData(optionList);
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
        <Multiselect options={multiOptionData} displayValue="name" />
      )}
    </div>
  );
}

export default ResponseMultiselectDropdown;
