import { useContext } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import PasswordForgot from "./pages/auth/PasswordForgot";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/authContext";

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;

  // create http link
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  // setContext for authtoken
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authtoken: user ? user.token : "",
      },
    };
  });

  // concat http and authtoken link
  const httpAuthLink = authLink.concat(httpLink);

  // create websocket link
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
    options: {
      reconnect: true,
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpAuthLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      <Switch>
        <PrivateRoute exact path="/home" component={Home}></PrivateRoute>
        <PublicRoute exact path="/register" component={Register}></PublicRoute>
        <PublicRoute exact path="/" component={Login}></PublicRoute>
        <PublicRoute
          exact
          path="/complete-registration"
          component={CompleteRegistration}
        />
        <PublicRoute
          exact
          path="/password/forgot"
          component={PasswordForgot}
        ></PublicRoute>
      </Switch>
    </ApolloProvider>
  );
};

export default App;
