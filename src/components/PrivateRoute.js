import React, { useContext, useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import LoadingToRedirect from "./LoadingToRedirect";

const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(false);

  //Check if user is logged in
  useEffect(() => {
    if (state.user) {
      setUser(true);
    }
  }, [state.user]);

  //
  const renderContent = () => (
    <div className="container-fluid">
      <div className="row">
        <Route {...rest} />
      </div>
    </div>
  );

  //Render content if user is logged in, otherwise redirect to login page
  return user ? renderContent() : <LoadingToRedirect path="/" />;
};

export default PrivateRoute;
