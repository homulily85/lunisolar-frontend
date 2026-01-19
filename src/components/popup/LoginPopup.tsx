import { type RefObject, useCallback } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { OAUTH_CLIENT_ID } from "../../config.ts";
import { useApolloClient } from "@apollo/client/react";
import { AUTH, REFRESH_ACCESS_TOKEN } from "../../graphql/query.ts";
import { toast } from "react-toastify";
import decodeAccessToken from "../../utils/decodeAccessToken.ts";
import {
    setAccessToken,
    setName,
    setProfilePictureLink,
    setUserId,
} from "../../reducers/userReducer.ts";
import { useAppDispatch } from "../../hook.ts";

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
                toast.error("Chứng chỉ không hợp lệ!");
                return;
            }

            const authResult = await client.mutate<
                { auth: string },
                { oauthToken: string }
            >({
                mutation: AUTH,
                variables: { oauthToken: credential },
            });

            if (authResult.data?.auth !== "success") {
                toast.error("Chứng chỉ không hợp lệ!");
                return;
            }

            const getAccessTokenResult = await client.mutate<{
                refreshAccessToken: string | null;
            }>({
                mutation: REFRESH_ACCESS_TOKEN,
            });

            const accessToken = getAccessTokenResult.data?.refreshAccessToken;

            if (!accessToken) {
                toast.error("Chứng chỉ không hợp lệ!");
                return;
            }

            const payload = decodeAccessToken(accessToken);
            dispatch(setAccessToken(accessToken));
            dispatch(setUserId(payload.userId));
            dispatch(setName(payload.name));
            dispatch(setProfilePictureLink(payload.profilePictureLink));
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
                        use_fedcm_for_button={false}
                        use_fedcm_for_prompt={false}
                        onSuccess={async (credentialResponse) => {
                            await getUserInfo(credentialResponse.credential);
                        }}></GoogleLogin>
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default LoginPopup;
