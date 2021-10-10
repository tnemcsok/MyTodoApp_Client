import React, { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TodoItem from "./TodoItem";
import {
  UPDATE_TODO,
  GET_ALL_TODOS,
  CLEAR_COMPLETED,
} from "../../graphql/mutations";

const DraggableList = (props) => {
  const [columns, setColumns] = useState({});
  const [todoUpdate] = useMutation(UPDATE_TODO);
  const [clearCompletedTodos] = useMutation(CLEAR_COMPLETED);

  //Save todos to state according to status
  useMemo(() => {
    if (props) {
      const columnsFromBackend = {
        Planned: {
          name: "Planned",
          items: props.planned,
        },
        inProgress: {
          name: "In progress",
          items: props.ongoing,
        },
        Finished: {
          name: "Finished",
          items: props.finished,
        },
      };
      setColumns({ ...columns, ...columnsFromBackend });
    }
  }, [props]);

  //Handle the drag of todos
  const onDragEnd = (result, columns, setColumns) => {
    //Handle if todo was not dragged to one of the lists
    if (!result.destination) return;
    const { source, destination } = result;

    //Handle if todo was dragged to another list
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      //Remove todo from previous list, insert to new
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      //Change the priority of todos
      destItems.forEach((item, index) => {
        if (index === destination.index) {
          if (props.type === "All") {
            todoUpdate({
              variables: {
                input: { _id: item._id, priority: index },
              },
            });
          } else {
            todoUpdate({
              variables: {
                input: { _id: item._id, thematicPriority: index },
              },
            });
          }
        } else if (index > destination.index) {
          let newPriority = item.priority + 1;
          if (props.type === "All") {
            todoUpdate({
              variables: {
                input: { _id: item._id, priority: newPriority },
              },
            });
          } else {
            todoUpdate({
              variables: {
                input: { _id: item._id, thematicPriority: newPriority },
              },
            });
          }
        }
      });

      //Update state
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      //Update the status of todo
      todoUpdate({
        variables: {
          input: { _id: removed._id, status: destination.droppableId },
        },
        refetchQueries: [{ query: GET_ALL_TODOS }],
      });
    }
    //Handle if todo was dragged within the same list
    else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];

      //Put todo to the new place
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      //Update priorities
      copiedItems.forEach((item, index) => {
        if (props.type === "All") {
          todoUpdate({
            variables: {
              input: { _id: item._id, priority: index },
            },
          });
        } else {
          todoUpdate({
            variables: {
              input: { _id: item._id, thematicPriority: index },
            },
          });
        }
      });

      //Update the state
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  //Handle button event if user want to clear all the completed todos
  const clearCompleted = () => {
    clearCompletedTodos({
      refetchQueries: [{ query: GET_ALL_TODOS }],
    });
  };

  return (
    <div className="row todoListWrapper">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className="shadow p-3" key={columnId}>
              <h2 className="text-center">{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          minHeight: 300,
                          position: "relative",
                        }}
                      >
                        <div className="d-flex flex-column justify-content-between">
                          <div>
                            {column.items.map((item, index) => {
                              return (
                                <div>
                                  <TodoItem item={item} index={index} />
                                </div>
                              );
                            })}
                          </div>
                          {column.name === "Finished" ? (
                            <button
                              className="btn btn-success clearBtn"
                              onClick={clearCompleted}
                            >
                              Clear completed
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default DraggableList;
