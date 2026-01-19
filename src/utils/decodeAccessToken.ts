import { jwtDecode } from "jwt-decode";
import type { AccessTokenPayload } from "../type.ts";

const decodeAccessToken = (token: string) => {
    return jwtDecode(token) as AccessTokenPayload;
};

export default decodeAccessToken;
