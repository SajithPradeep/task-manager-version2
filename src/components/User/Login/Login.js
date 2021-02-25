import React, { useContext, useEffect, useState } from "react";
import userContext from "../../../context/user-context";
import { withRouter } from "react-router-dom";
import Loader from "react-loader";

import "./Login.scss";

const Login = (props) => {
  const { userAuthState, setUserAuthState } = useContext(userContext);
  const [loaderState, setLoaderState] = useState(false);

  useEffect(() => {
    if (userAuthState) {
      props.history.push("/");
    }
  }, [userAuthState, props.history]);

  const loginSubmitHandler = (e) => {
    e.preventDefault();
    setLoaderState(true);
    const payload = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    fetch(
      "http://localhost:8080/https://sajith-task-manager.herokuapp.com/user/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setLoaderState(false);
        if (responseData.user) {
          setUserAuthState(responseData);
          localStorage.setItem("authToken", responseData.token);
          props.history.push("/");
        } else {
          throw new Error("Cannot login");
        }
      })
      .catch((err) => {
        alert("Please check the credentials");
        setLoaderState(false);
        console.log(err);
      });
  };
  return (
    <>
      {loaderState ? (
        <Loader loaded={!loaderState} />
      ) : (
        <div className="Login">
          <p className="login-signup-header">Login</p>
          <form
            onSubmit={loginSubmitHandler}
            className="Login-form"
            autoComplete="off"
          >
            <div className="Login-form-item">
              <input
                type="text"
                name="name"
                placeholder="Enter Name [Optional]"
                className="login-signup-input"
              />
            </div>
            <div className="Login-form-item">
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                className="login-signup-input"
              />
            </div>
            <div className="Login-form-item">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="login-signup-input"
              />
            </div>
            <button className="btn-primary" type="Submit">
              Submit
            </button>
          </form>
          <p className="lead-paragraph">Don't have an account? </p>
          <button
            className="btn-secondary"
            onClick={() => props.setLoginSignUpState("signup")}
          >
            Create Account
          </button>
        </div>
      )}
    </>
  );
};

export default withRouter(Login);
