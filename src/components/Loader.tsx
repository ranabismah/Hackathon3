import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-golden border-solid"></div>
    </div>
  );
};

export default Loader;
