import React, { useState, useEffect } from "react";

const CommonCompopnentsPage = () => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      setAuth(true);
      fetch(
        "http://localhost:8080/https://sajith-task-manager.herokuapp.com/users/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          setUser(responseData);
        })
        .catch((err) => {
          alert("could not find the user please login");
          console.log(err.message);
          localStorage.setItem("token", null);
        });
    }
  }, []);

  const handleSignUpHandler = (e) => {
    e.preventDefault();
    const payload = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    fetch(
      "http://localhost:8080/https://sajith-task-manager.herokuapp.com/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setUser(responseData.user);
        localStorage.setItem("token", responseData.token);
        setAuth(true);
      })
      .catch((err) => {
        alert("Could not sign in");
        console.log(err);
      });
  };

  const handleLogoutHandler = () => {
    fetch(
      "http://localhost:8080/https://sajith-task-manager.herokuapp.com/user/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        localStorage.setItem("token", "");
        setAuth(false);
        setUser(null);
        console.log(responseData);
      })
      .catch((err) => {
        alert("error");
        console.log(err);
      });
  };

  return (
    <>
      <div className="App">
        {!auth && (
          <div className="App-login">
            <div className="App-sign-up">
              <h2>Login</h2>
            </div>
            <form onSubmit={handleSignUpHandler}>
              <input type="text" name="name" placeholder="Name" />
              <input type="email" name="email" placeholder="Email" />
              <input type="password" name="password" placeholder="Password" />
              <button type="Submit">Submit</button>
            </form>
          </div>
        )}
        {user && (
          <div className="App-user-details">
            <h2 className="App-user-details-name">Welcome back {user.name}</h2>
          </div>
        )}
        <div className="App-logout">
          <button onClick={handleLogoutHandler}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default CommonCompopnentsPage;
