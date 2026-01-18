import { type RefObject, useCallback } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { OAUTH_CLIENT_ID } from "../../config.ts";
import { useApolloClient } from "@apollo/client/react";
import { AUTH } from "../../graphql/query.ts";
import { useAppDispatch } from "../../hook.ts";
import {
    setId,
    setName,
    setProfilePictureLink,
    setToken,
} from "../../reducers/userReducer.ts";
import { toast } from "react-toastify";
import type { AuthPayload, AuthVars } from "../../type.ts";

const LoginPopup = ({
    popupRef,
}: {
    popupRef: RefObject<HTMLDivElement | null>;
}) => {
    const client = useApolloClient();
    const dispatch = useAppDispatch();

    const getUserInfo = useCallback(
        async (credential?: string) => {
            if (!credential) {
                toast.error("Missing credential!");
                return;
            }

            const result = await client.mutate<AuthPayload, AuthVars>({
                mutation: AUTH,
                variables: { oauthToken: credential },
            });

            if (!result.data?.auth) {
                toast.error("Chứng chỉ đăng nhập không hợp lệ!");
                return;
            }

            const { auth } = result.data;
            dispatch(setName(auth.name));
            dispatch(setId(auth.id));
            dispatch(setProfilePictureLink(auth.profilePictureLink ?? ""));
            dispatch(setToken(auth.token));
        },
        [client, dispatch],
    );

    return (
        <div
            ref={popupRef}
            className={`absolute w-max top-full right-1 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow z-50`}>
            <p className='font-bold'>
                Đăng nhập để quản lý lịch trình của bạn!
            </p>
            <div className='flex mt-3 w-full justify-center align-middle'>
                <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
                    <GoogleLogin
                        use_fedcm_for_button={true}
                        use_fedcm_for_prompt={true}
                        onSuccess={async (credentialResponse) => {
                            await getUserInfo(credentialResponse.credential);
                        }}></GoogleLogin>
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default LoginPopup;
