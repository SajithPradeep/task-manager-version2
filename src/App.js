import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Loader from "react-loader";

// import CommonCompopnentsPage from "./components/common-components/CommonComponentsPage";
import Dashboard from "./components/Dashboard/Dashboard";
import AddTaskPage from "./components/AddTaskPage/AddTaskPage";
import UserProfilePage from "./components/UserProfilePage/UserProfilePage";
import User from "./components/User/User";
import Header from "./components/UI/Header/Header";
import Footer from "./components/UI/Footer/Footer";

import userContext from "./context/user-context";

import "./App.css";

function App(props) {
  const [userAuthState, setUserAuthState] = useState(null);
  const [iconString, setIconString] = useState("");
  const [loaderState, setLoaderState] = useState(false);

  useEffect(() => {
    if (!userAuthState) {
      if (localStorage.getItem("authToken")) {
        setLoaderState(true);
        fetch(
          "http://localhost:8080/https://sajith-task-manager.herokuapp.com/users/me",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("authToken"),
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((responseData) => {
            setUserAuthState({
              user: responseData,
              token: localStorage.getItem("authToken"),
            });
            setLoaderState(false);
          });
      }
    }
  }, [setLoaderState, userAuthState]);

  useEffect(() => {
    console.log("userAuthState", userAuthState);
    if (userAuthState) {
      let nameArray = userAuthState.user.name.split(" ");
      let iconStringTemp = "";
      for (let string in nameArray) {
        iconStringTemp = (
          iconStringTemp + nameArray[string].charAt(0)
        ).toUpperCase();
      }
      setIconString(iconStringTemp);
    }
  }, [userAuthState]);
  return (
    <userContext.Provider
      value={{ userAuthState, setUserAuthState, iconString }}
    >
      <BrowserRouter>
        <Header />
        <div className="container">
          {loaderState ? (
            <Loader loaded={!loaderState} />
          ) : (
            <Switch>
              <Route path="/" component={Dashboard} exact={true} />
              <Route path="/login" component={User} />
              <Route path="/add-task" component={AddTaskPage} />
              <Route path="/user-profile" component={UserProfilePage} />
            </Switch>
          )}
        </div>
        <Footer />
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
