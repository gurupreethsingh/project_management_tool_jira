import React from "react";

const PageNotFound = () => {
  return (
    <div>
      <div className="page_not_found border rounded-xl mx-auto p-5 m-5">
        <h1 className="text-red-500 text-center text-3xl font-bold">
          404 page not found
        </h1>
        <a href="/homepage">Back To Homepage &rarr; </a>
      </div>
    </div>
  );
};

export default PageNotFound;
