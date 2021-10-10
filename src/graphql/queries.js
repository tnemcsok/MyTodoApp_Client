import { gql } from "@apollo/client";
import { USER_INFO } from "./fragments";

export const PROFILE = gql`
  ${USER_INFO}
  query {
    profile {
      ...UserInfo
    }
  }
`;
