import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TODO } from "../../graphql/mutations";
import { GET_ALL_TODOS } from "../../graphql/mutations";

const TodoInput = (props) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const { setShow } = props;

  //Reset form after submit
  const resetInput = () => {
    setTitle("");
    setDeadline("");
    setDescription("");
    setType("");
    setShow(false);
  };

  const [createTodo] = useMutation(CREATE_TODO);

  return (
    <div className="p-3 position-relative">
      <div className="d-flex justify-content-between">
        <h4 className="mb-3">Insert todos</h4>
        <button className="closeBtn" onClick={() => setShow(false)}>
          x
        </button>
      </div>
      <form
        className="formInput w-80 m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          //Send todo to database
          createTodo({
            variables: {
              input: {
                title: title,
                deadline: deadline,
                description: description,
                type: type,
              },
            },
            //Update todolist with the new todo
            refetchQueries: [{ query: GET_ALL_TODOS }],
          });
          //Clear the form
          resetInput();
        }}
      >
        <div className="form-group">
          <label className="font-weight-bold mb-2">Title</label>
          <input
            className="form-control mb-3"
            type="text"
            value={title}
            placeholder="Todo title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="font-weight-bold mb-2">Deadline</label>
          <input
            className="form-control mb-3"
            type="date"
            value={deadline}
            placeholder="When to do?"
            onChange={(e) => setDeadline(e.target.value)}
          />
          <label className="font-weight-bold mb-2">Description</label>
          <textarea
            className="form-control mb-3"
            type="text"
            value={description}
            placeholder="What to do?"
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="font-weight-bold mb-2">Type</label>
          <select
            className="form-control bg-light mb-3"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="" disabled selected>
              Choose type
            </option>
            <option value="Work">Work</option>
            <option value="Family">Family</option>
            <option value="Programming">Programming</option>
            <option value="General">General</option>
          </select>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-success d-block w-50 m-auto"
            >
              Register todo
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoInput;
