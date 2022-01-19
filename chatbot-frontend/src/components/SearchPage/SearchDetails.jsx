import React from "react";

const SearchDetails = ({ searchedReasult }) => {
  console.log("search details", searchedReasult);

  const handleClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="border-2 bg-white rounded-md p-2 flex flex-col overflow-y-scroll h-[30rem] text-dark ">
      <div className="col-md-12 py-3 text-dark overflow-auto">
        {console.log("search details items", searchedReasult.data.items)}

        {searchedReasult.data.items &&
          searchedReasult.data.items.map((item, i) => (
            <div key={i} className="text-left overflow-auto text-dark">
              <a
                href={item.displayLink}
                className="font-weight-normal header-post text-dark text-decoration-none text-left"
              >
                {item.displayLink}
              </a>

              <h5>
                <div
                  href={item.formattedUrl}
                  className="link-text text-decoration: no-underline hover:underline text-blue-600 decoration-solid text-left"
                  onClick={() => handleClick(item.formattedUrl)}
                >
                  {" "}
                  {item.title}
                </div>
              </h5>
              <br />
            </div>
          ))}
      </div>
    </div>
  );
};
export default SearchDetails;
