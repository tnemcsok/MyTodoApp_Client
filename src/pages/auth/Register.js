import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";
import { Link } from "react-router-dom";

const Register = ({ setShowLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      handleCodeInApp: true,
    };
    const result = await auth.sendSignInLinkToEmail(email, config);
    console.log(result);
    // show toast notification to user about email sent
    toast.success(
      `Email is sent to ${email}. click the link to complete your registration.`
    );

    // save user email to local storage
    window.localStorage.setItem("emailForRegistration", email);
    // clear state
    setEmail("");
    setLoading("");
  };

  return (
    <div className="w-50 m-auto shadow p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : ""}
      <h2 className="logo">MyTodoApp</h2>
      <AuthForm
        email={email}
        loading={loading}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
      />
      <Link className="text-danger fw-bold float-end" to="/">
        Login
      </Link>
    </div>
  );
};

export default Register;
