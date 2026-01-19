import { gql } from "@apollo/client";

export const AUTH = gql`
    mutation ($oauthToken: String!) {
        auth(oauthToken: $oauthToken)
    }
`;

export const REFRESH_ACCESS_TOKEN = gql`
    mutation {
        refreshAccessToken
    }
`;
