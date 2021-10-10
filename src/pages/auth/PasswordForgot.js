import React, { useState } from "react";
import { useHistory } from "react-router";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";
import { Link } from "react-router-dom";

const PasswordForgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success(
          `Email is sent to ${email}. Click on the link to reset your password`
        );
      })
      .catch((error) => {
        setLoading(false);
        console.log("error on password forgot email", error);
      });
    history.push("/");
  };

  return (
    <div className="w-50 m-auto shadow p-5">
      <h2 className="logo">MyTodoApp</h2>
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Forgot Password </h4>
      )}

      <AuthForm
        email={email}
        setEmail={setEmail}
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <Link className="text-danger float-end fw-bold" to="/">
        Login
      </Link>
    </div>
  );
};

export default PasswordForgot;
