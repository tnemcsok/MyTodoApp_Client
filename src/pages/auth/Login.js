import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import AuthForm from "../../components/forms/AuthForm";

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  let history = useHistory();

  const [createUser] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          const { user } = result;
          const idTokenResult = await user.getIdTokenResult();

          dispatch({
            type: "LOGGED_IN_USER",
            payload: { email: user.email, token: idTokenResult.token },
          });
          createUser();
          history.push("/home");
        });
    } catch (error) {
      console.log("login error", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    await auth.signInWithPopup(googleAuthProvider).then(async (result) => {
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user.email, token: idTokenResult.token },
      });

      // send user info to our server mongodb to either update/create
      createUser();
      history.push("/home");
    });
  };

  return (
    <div className="w-50 m-auto shadow p-5">
      {loading ? <div></div> : ""}
      <h2 className="logo">MyTodoApp</h2>
      <button
        onClick={googleLogin}
        className="btn btn-raised btn-primary mt-3 mb-3"
      >
        Login with Google
      </button>
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        handleSubmit={handleSubmit}
        showPasswordInput="true"
      />
      <div className="d-flex justify-content-between mt-3">
        <Link className="fw-bold text-dark" to="/register">
          Register
        </Link>
        <Link className="text-danger fw-bold" to="/password/forgot">
          Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default Login;
