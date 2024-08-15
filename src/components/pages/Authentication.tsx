import React from "react";
import Google from "../elements/authen/google";
import Login from "../elements/authen/login";
import TabAuthen from "../elements/authen/tabAuthen";


const Authentication = () => {
  return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    {/* <Google/> */}
    {/* <Login/> */}
    <div className="bg-black px-5 py-7">
    <TabAuthen />
    </div>
  </div>
};

export default Authentication;
