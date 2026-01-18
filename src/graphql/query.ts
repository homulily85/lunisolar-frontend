import { gql } from "@apollo/client";

export const AUTH = gql`
    mutation ($oauthToken: String!) {
        auth(oauthToken: $oauthToken) {
            id
            name
            profilePictureLink
            token
        }
    }
`;
