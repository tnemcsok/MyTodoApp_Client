import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_ALL_TODOS } from "../../graphql/mutations";
import { DELETE_TODO } from "../../graphql/mutations";
import { TOGGLE_URGENT } from "../../graphql/mutations";
import { Draggable } from "react-beautiful-dnd";

const TodoItem = ({ item, index }) => {
  const [deleteTodoMutation] = useMutation(DELETE_TODO);
  const [toggleUrgentMutation] = useMutation(TOGGLE_URGENT);
  const [show, setShow] = useState(false);

  //Handle todo delete
  const removeTodo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTodoMutation({
      variables: { id: item._id },
      refetchQueries: [{ query: GET_ALL_TODOS }],
    });
  };

  //Handle click on urgent sign
  const togleUrgent = () => {
    toggleUrgentMutation({
      variables: { id: item._id },
      refetchQueries: [{ query: GET_ALL_TODOS }],
    });
  };

  //Show details of todo on doubleclick
  const doubleClick = () => {
    setShow(!show);
  };

  return (
    <Draggable key={item._id} draggableId={item._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={
            "border m-auto mb-3" +
            (!item.urgent ? " bg-light" : " bg-danger text-light")
          }
        >
          <div
            className="position-relative min-height p-2"
            onDoubleClick={doubleClick}
          >
            <div className="w-80 h-100 min-height d-flex flex-column justify-content-center m-auto">
              <h5 className="text-center font-weight-bold mb-2">
                {item.title}
              </h5>
              <div className={"text-center mb-2 " + (show ? "show" : "hide")}>
                {item.deadline}
              </div>
              <div className={"text-center " + (show ? "show" : "hide")}>
                {item.description}
              </div>
            </div>

            <button className="closeBtn" onClick={removeTodo}>
              x
            </button>
            <button className="urgentBtn" onClick={togleUrgent}>
              !
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TodoItem;
