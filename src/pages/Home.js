import TodoList from "../components/Todos/TodoList";
import { useQuery } from "@apollo/client";
import { GET_ALL_TODOS } from "../graphql/mutations";

const Home = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_TODOS);

  if (loading) {
    return <div></div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  return <TodoList todos={data.allTodos} key={data} refetch={refetch} />;
};

export default Home;
