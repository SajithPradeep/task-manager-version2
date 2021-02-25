import React, { useContext, useState } from "react";
import Loader from "react-loader";

import { withRouter } from "react-router-dom";
import userContext from "../../../context/user-context";

import "./SignUp.scss";

const SignUp = (props) => {
  const { setUserAuthState } = useContext(userContext);

  const [loadingState, setLoadingState] = useState(false);
  const [signUpError, setSignUpError] = useState({});
  const [userDetails, setUserDetails] = useState({});

  const signupSubmitHandler = (e) => {
    e.preventDefault();
    setLoadingState(true);
    let payload = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    setUserDetails(payload);

    fetch(
      "http://localhost:8080/https://sajith-task-manager.herokuapp.com/users",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        setLoadingState(false);
        if (responseData.user) {
          setUserAuthState(responseData);
          localStorage.setItem("authToken", responseData.token);
          props.history.push("/");
        } else {
          setSignUpError(responseData.errors);
          throw new Error(responseData);
        }
      })
      .catch((err) => {
        setLoadingState(false);
        if (signUpError.name || signUpError.email || signUpError.password) {
          console.log("Error");
        } else {
          alert("Cannot sign up. Please try again");
        }
      });
  };

  const onInputChangeHandler = (name, email, password) => {
    setUserDetails((prevState) => {
      return {
        name: name ? name : prevState.name,
        email: email ? email : prevState.email,
        password: password ? password : prevState.password,
      };
    });
  };

  return (
    <div className="signup">
      {loadingState ? (
        <Loader loaded={!loadingState} />
      ) : (
        <>
          <p className="login-signup-header">Sign Up</p>
          <form
            onSubmit={signupSubmitHandler}
            className="signup-form"
            autoComplete="off"
          >
            <div className="signup-form-item">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                className="login-signup-input"
                value={userDetails.name}
                onChange={(e) => {
                  onInputChangeHandler(e.target.value);
                }}
              />
              {signUpError.name && (
                <p className="signup-form-item-errorMsg">
                  Enter your full name
                </p>
              )}
            </div>
            <div className="signup-form-item">
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                className="login-signup-input"
                value={userDetails.email}
                onChange={(e) =>
                  onInputChangeHandler(undefined, e.target.value)
                }
              />
              {signUpError.email && (
                <p className="signup-form-item-errorMsg">
                  Enter a valid Email Address
                </p>
              )}
            </div>
            <div className="signup-form-item">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="login-signup-input"
                value={userDetails.password}
                o
                onChange={(e) => {
                  onInputChangeHandler(undefined, undefined, e.target.value);
                }}
              />
              {signUpError.password && (
                <p className="signup-form-item-errorMsg">
                  Password Criteria - 7 characters long, should contain
                  combination of numbers letters and special characters
                </p>
              )}
            </div>
            <button className="btn-primary" type="Submit">
              Submit
            </button>
          </form>
          <p className="lead-paragraph">Login instead? </p>
          <button
            className="btn-secondary"
            onClick={() => props.setLoginSignUpState("login")}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default withRouter(SignUp);
