import { gql } from "@apollo/client";

export const USER_INFO = gql`
  fragment UserInfo on User {
    _id
    name
    username
    email
    images {
      url
      public_id
    }
    about
    createdAt
    updatedAt
  }
`;

export const TODO_INFO = gql`
  fragment TodoInfo on Todo {
    _id
    title
    description
    deadline
    status
    created_at
    urgent
    type
    priority
    thematicPriority
  }
`;
