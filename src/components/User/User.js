import React, { useState } from "react";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";

import "./User.scss";

const User = () => {
  const [loginSignUpState, setLoginSignUpState] = useState("login");
  return (
    <div className="user-container">
      {loginSignUpState === "login" ? (
        <Login setLoginSignUpState={setLoginSignUpState} />
      ) : (
        <SignUp setLoginSignUpState={setLoginSignUpState} />
      )}
    </div>
  );
};

export default User;
