import React, { useEffect, useContext } from "react";
import userContext from "../../context/user-context";

import "./Dashboard.scss";

const Dashboard = (props) => {
  const { userAuthState } = useContext(userContext);
  useEffect(() => {
    if (!userAuthState) {
      props.history.push("/login");
    }
  }, [props.history, userAuthState]);
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
        <p>Welcome to Dashboard</p>
      </div>
    </div>
  );
};

export default Dashboard;
