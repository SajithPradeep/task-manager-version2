import React, { useState, useRef, useEffect, useContext } from "react";
import { withRouter, NavLink } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import Loader from "react-loader";

import "./Header.scss";

import Logout from "../Logout/Logout";
import userContext from "../../../context/user-context";

const Header = (props) => {
  const [logoutModalState, setLogoutModalState] = useState(false);
  const [loaderState, setLoaderState] = useState(false);

  const [hamburgerState, setHamburgerState] = useState(false);
  const { userAuthState, setUserAuthState, iconString } = useContext(
    userContext
  );

  const [iconInitials, setIconInitials] = useState("");

  useEffect(() => {
    if (userAuthState) {
      setIconInitials(iconString);
    } else {
      setIconInitials("");
    }
  }, [userAuthState, logoutModalState, iconString]);

  // *****************************************************************
  //Custom Hook that alerts clicks outside of the passed ref
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          (ref.current.style.display =
            "block" && !ref.current.contains(event.target))
        ) {
          hamburgerSideMenuRef.current.style.display = "none";
          setHamburgerState(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  // **********************************************************************

  const hamburgerSideMenuRef = useRef();
  useOutsideAlerter(hamburgerSideMenuRef);

  const handleOutsideLogoutModalClick = () => {
    console.log("handle Outside click triggered");
    setLogoutModalState(false);
  };

  const handleHamburgerClick = () => {
    if (!hamburgerState) {
      hamburgerSideMenuRef.current.style.display = "block";
      setHamburgerState(true);
    } else {
      hamburgerSideMenuRef.current.style.display = "none";
      setHamburgerState(false);
    }
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    const logoutHttp = (callback) => {
      setLoaderState(true);
      console.log("logout http function called");
      fetch(
        "http://localhost:8080/https://sajith-task-manager.herokuapp.com/user/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: userAuthState.token,
          },
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          localStorage.setItem("authToken", "");
          setUserAuthState(null);
          setLogoutModalState(false);
          setLoaderState(false);
          callback();
          props.history.push("/login");
        })
        .catch((err) => {
          alert("Error while loggin out");
          console.log(err);
          setLoaderState(false);
        });
    };

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to Logout?</p>
            <button
              style={{
                padding: "0.2rem 0.3rem",
                background: "red",
                color: "white",
                borderRadius: "5px",
                marginRight: "1rem",
                fontSize: "1.5rem",
                border: "1px solid white",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              No
            </button>
            <button
              onClick={() => {
                logoutHttp(onClose);
              }}
              style={{
                padding: "0.2rem 0.3rem",
                background: "steelblue",
                color: "white",
                borderRadius: "5px",
                marginRight: "1rem",
                fontSize: "1.5rem",
                border: "1px solid white",
                cursor: "pointer",
              }}
            >
              Yes, Logout!
            </button>
          </div>
        );
      },
    });
  };

  const handleUserIconClick = (e) => {
    console.log("user icon clicked");
    e.preventDefault();
    setLogoutModalState((prevState) => {
      return !prevState;
    });
  };
  return (
    <>
      <header className="header">
        <div className="header-app-logo">TM</div>
        <nav className="header-navigation">
          <div>
            <ul>
              <li>
                <NavLink to="/" exact activeClassName="active">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/add-task" activeClassName="active">
                  Add Task
                </NavLink>
              </li>
              <li>
                <NavLink to="/user-profile" activeClassName="active">
                  User Profile
                </NavLink>
              </li>
            </ul>
          </div>
          {iconInitials && (
            <div
              className="header-navigation-icon"
              onClick={handleUserIconClick}
            >
              <p>{iconInitials}</p>
            </div>
          )}
          <Logout
            logoutHandler={logoutHandler}
            logoutModalState={logoutModalState}
            handleOutsideLogoutModalClick={handleOutsideLogoutModalClick}
          />
          <div>
            <img
              onClick={handleHamburgerClick}
              alt="Hamburger-Icon"
              src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgLTk0NjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAiIHgyPSI1MTIiIHkxPSItOTcxOCIgeTI9Ii05NzE4Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMGYxZmYiLz48c3RvcCBvZmZzZXQ9Ii4yMzEiIHN0b3AtY29sb3I9IiMwMGQ4ZmYiLz48c3RvcCBvZmZzZXQ9Ii41MTM4IiBzdG9wLWNvbG9yPSIjMDBjMGZmIi8+PHN0b3Agb2Zmc2V0PSIuNzc3MyIgc3RvcC1jb2xvcj0iIzAwYjJmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwYWRmZiIvPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggZD0ibTUxMiAyNTZjMCAxNDEuMzg2NzE5LTExNC42MTMyODEgMjU2LTI1NiAyNTZzLTI1Ni0xMTQuNjEzMjgxLTI1Ni0yNTYgMTE0LjYxMzI4MS0yNTYgMjU2LTI1NiAyNTYgMTE0LjYxMzI4MSAyNTYgMjU2em0wIDAiIGZpbGw9InVybCgjYSkiLz48ZyBmaWxsPSIjZmZmIj48cGF0aCBkPSJtMzc3LjQ2MDkzOCAxODUuNTc0MjE5aC0yNDIuOTIxODc2Yy0yOC4xNDQ1MzEgMC01MS4wMzkwNjItMjIuODk0NTMxLTUxLjAzOTA2Mi01MS4wMzUxNTcgMC0yOC4xNDQ1MzEgMjIuODk0NTMxLTUxLjAzOTA2MiA1MS4wMzkwNjItNTEuMDM5MDYyaDI0Mi45MjE4NzZjMjguMTQ0NTMxIDAgNTEuMDM5MDYyIDIyLjg5NDUzMSA1MS4wMzkwNjIgNTEuMDM5MDYyIDAgMjguMTQwNjI2LTIyLjg5NDUzMSA1MS4wMzUxNTctNTEuMDM5MDYyIDUxLjAzNTE1N3ptLTI0Mi45MjE4NzYtNzIuMDc0MjE5Yy0xMS42MDE1NjIgMC0yMS4wMzkwNjIgOS40Mzc1LTIxLjAzOTA2MiAyMS4wMzkwNjIgMCAxMS41OTc2NTcgOS40Mzc1IDIxLjAzNTE1NyAyMS4wMzkwNjIgMjEuMDM1MTU3aDI0Mi45MjE4NzZjMTEuNjAxNTYyIDAgMjEuMDM5MDYyLTkuNDM3NSAyMS4wMzkwNjItMjEuMDM1MTU3IDAtMTEuNjAxNTYyLTkuNDM3NS0yMS4wMzkwNjItMjEuMDM5MDYyLTIxLjAzOTA2MnptMCAwIi8+PHBhdGggZD0ibTM3Ny40NjA5MzggMzA3LjAzOTA2MmgtMjQyLjkyMTg3NmMtMjguMTQ0NTMxIDAtNTEuMDM5MDYyLTIyLjg5ODQzNy01MS4wMzkwNjItNTEuMDM5MDYyczIyLjg5NDUzMS01MS4wMzkwNjIgNTEuMDM5MDYyLTUxLjAzOTA2MmgyNDIuOTIxODc2YzI4LjE0NDUzMSAwIDUxLjAzOTA2MiAyMi44OTg0MzcgNTEuMDM5MDYyIDUxLjAzOTA2MnMtMjIuODk0NTMxIDUxLjAzOTA2Mi01MS4wMzkwNjIgNTEuMDM5MDYyem0tMjQyLjkyMTg3Ni03Mi4wNzgxMjRjLTExLjYwMTU2MiAwLTIxLjAzOTA2MiA5LjQzNzUtMjEuMDM5MDYyIDIxLjAzOTA2MnM5LjQzNzUgMjEuMDM5MDYyIDIxLjAzOTA2MiAyMS4wMzkwNjJoMjQyLjkyMTg3NmMxMS42MDE1NjIgMCAyMS4wMzkwNjItOS40Mzc1IDIxLjAzOTA2Mi0yMS4wMzkwNjJzLTkuNDM3NS0yMS4wMzkwNjItMjEuMDM5MDYyLTIxLjAzOTA2MnptMCAwIi8+PHBhdGggZD0ibTM3Ny40NjA5MzggNDI4LjVjLTguMjgxMjUgMC0xNS02LjcxNDg0NC0xNS0xNXM2LjcxODc1LTE1IDE1LTE1YzExLjYwMTU2MiAwIDIxLjAzOTA2Mi05LjQzNzUgMjEuMDM5MDYyLTIxLjAzOTA2MiAwLTExLjU5NzY1Ny05LjQzNzUtMjEuMDM1MTU3LTIxLjAzOTA2Mi0yMS4wMzUxNTdoLTI0Mi45MjE4NzZjLTExLjYwMTU2MiAwLTIxLjAzOTA2MiA5LjQzNzUtMjEuMDM5MDYyIDIxLjAzNTE1NyAwIDExLjYwMTU2MiA5LjQzNzUgMjEuMDM5MDYyIDIxLjAzOTA2MiAyMS4wMzkwNjJoMTc2LjE4NzVjOC4yODEyNSAwIDE1IDYuNzE0ODQ0IDE1IDE1cy02LjcxODc1IDE1LTE1IDE1aC0xNzYuMTg3NWMtMjguMTQ0NTMxIDAtNTEuMDM5MDYyLTIyLjg5NDUzMS01MS4wMzkwNjItNTEuMDM5MDYyIDAtMjguMTQwNjI2IDIyLjg5NDUzMS01MS4wMzUxNTcgNTEuMDM5MDYyLTUxLjAzNTE1N2gyNDIuOTIxODc2YzI4LjE0NDUzMSAwIDUxLjAzOTA2MiAyMi44OTQ1MzEgNTEuMDM5MDYyIDUxLjAzNTE1NyAwIDI4LjE0NDUzMS0yMi44OTQ1MzEgNTEuMDM5MDYyLTUxLjAzOTA2MiA1MS4wMzkwNjJ6bTAgMCIvPjwvZz48L3N2Zz4="
            />
          </div>
        </nav>
      </header>
      <div className="hamburger-sidemenu" ref={hamburgerSideMenuRef}>
        <ul>
          <li>
            <NavLink to="/" exact activeClassName="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-task" activeClassName="active">
              Add Task
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-profile" activeClassName="active">
              User Profile
            </NavLink>
          </li>
        </ul>
      </div>
      {hamburgerState && <div className="backdrop"></div>}
      {loaderState && <Loader loaded={!loaderState} />}
    </>
  );
};

export default withRouter(Header);
