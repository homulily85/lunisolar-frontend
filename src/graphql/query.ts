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

export const LOGOUT = gql`
    mutation {
        logout
    }
`;

export const ADD_EVENT = gql`
    mutation ($newEvent: EventInput!) {
        addEvent(newEvent: $newEvent) {
            id
        }
    }
`;

export const GET_EVENT = gql`
    query ($rangeStart: String!, $rangeEnd: String!) {
        getEvents(rangeStart: $rangeStart, rangeEnd: $rangeEnd) {
            id
            title
            place
            isAllDay
            startDateTime
            endDateTime
            rruleString
            description
            reminder
        }
    }
`;
