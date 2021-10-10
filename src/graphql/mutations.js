import { gql } from "@apollo/client";
import { USER_INFO, TODO_INFO } from "./fragments";

export const USER_UPDATE = gql`
  ${USER_INFO}
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...UserInfo
    }
  }
`;

export const CREATE_TODO = gql`
  ${TODO_INFO}
  mutation todoCreate($input: TodoCreateInput!) {
    todoCreate(input: $input) {
      ...TodoInfo
    }
  }
`;

export const GET_ALL_TODOS = gql`
  ${TODO_INFO}
  query allTodos {
    allTodos {
      ...TodoInfo
    }
  }
`;

export const CLEAR_COMPLETED = gql`
  mutation clearCompleted {
    clearCompleted {
      _id
    }
  }
`;

export const DELETE_TODO = gql`
  mutation todoDelete($id: String!) {
    todoDelete(todoId: $id) {
      _id
    }
  }
`;

export const TOGGLE_URGENT = gql`
  mutation toggleUrgent($id: String!) {
    toggleUrgent(todoId: $id) {
      _id
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation todoUpdate($input: TodoUpdateInput!) {
    todoUpdate(input: $input) {
      _id
    }
  }
`;
