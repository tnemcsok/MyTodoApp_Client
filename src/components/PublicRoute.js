import React, { useContext, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const PublicRoute = ({ ...rest }) => {
  const { state } = useContext(AuthContext);
  let history = useHistory();

  //If user is logged in redirect to home page
  useEffect(() => {
    if (state.user) {
      history.push("home");
    }
  }, [state.user]);

  return (
    <div className="wrapper">
      <Route {...rest} />
    </div>
  );
};

export default PublicRoute;
