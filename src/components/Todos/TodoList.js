import React, { useState } from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import TodoInput from "../../components/Todos/TodoInput";
import DraggableList from "./DragableLists";

const TodoList = (props) => {
  const [type, setType] = useState("All");
  const { dispatch } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  let history = useHistory();

  //Handle logout
  const logout = async () => {
    await firebase.auth().signOut();
    dispatch({
      type: "LOGGED_IN_USER",
      payload: null,
    });
    history.push("/");
  };

  //Destructure todos
  let { todos } = props;

  //Filter todos by type
  todos = type !== "All" ? todos.filter((todo) => todo.type === type) : todos;

  //Push todos to differenet arrays according to status
  let plannedTodos = todos
    .filter((todo) => todo.status === "Planned")
    .sort((a, b) => {
      if (type === "All") return a.priority - b.priority;
      else return a.thematicPriority - b.thematicPriority;
    });

  let ongoingTodos = todos
    .filter((todo) => todo.status === "inProgress")
    .sort((a, b) => {
      if (type === "All") return a.priority - b.priority;
      else return a.thematicPriority - b.thematicPriority;
    });

  let finishedTodos = todos
    .filter((todo) => todo.status === "Finished")
    .sort((a, b) => {
      if (type === "All") return a.priority - b.priority;
      else return a.thematicPriority - b.thematicPriority;
    });

  //Handle type change
  const handleChange = (e) => {
    e.preventDefault();
    setType(e.target.value);
    props.refetch();
  };

  return (
    <div>
      <div className="w-90 m-auto p-3">
        <div className="d-flex justify-content-between align-items-center p-2 mb-3">
          <h2 className="smallLogo">MyTodoApp</h2>
          <button className="btn btn-success" onClick={() => setShow(true)}>
            Insert todo
          </button>

          <div className="w-25">
            <label className="font-weight-bold mb-2">Filter</label>
            <select
              className="form-control bg-light w-50"
              onChange={handleChange}
              defaultValue={{ value: "All" }}
            >
              <option value="All">All</option>
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="Programming">Programming</option>
              <option value="General">General</option>
            </select>
          </div>
          <button onClick={logout} href="/login" className="btn btn-success">
            Logout
          </button>
        </div>
        <div className={"todoInputWrapper mb-5 " + (show ? "show" : "hide")}>
          <TodoInput setShow={setShow} />
        </div>
        <div>
          <DraggableList
            planned={plannedTodos}
            ongoing={ongoingTodos}
            finished={finishedTodos}
            type={type}
            key={type}
          />
        </div>
        <div className="mt-3">* Double click on todo to show details</div>
      </div>
    </div>
  );
};

export default TodoList;
