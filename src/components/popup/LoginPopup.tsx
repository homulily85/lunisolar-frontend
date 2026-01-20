import { type RefObject, useCallback, useState } from "react";
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

const INVALID_MSG = "Chứng chỉ không hợp lệ!";

const LoginPopup = ({
    popupRef,
}: {
    popupRef: RefObject<HTMLDivElement | null>;
}) => {
    const client = useApolloClient();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const showInvalid = useCallback(() => {
        toast.error(INVALID_MSG);
    }, []);

    const getUserInfo = useCallback(
        async (credential?: string) => {
            if (loading) return;
            if (!credential) {
                showInvalid();
                return;
            }

            setLoading(true);
            try {
                const authResult = await client.mutate<
                    { auth: string },
                    { oauthToken: string }
                >({
                    mutation: AUTH,
                    variables: { oauthToken: credential },
                });

                if (authResult.data?.auth !== "success") {
                    showInvalid();
                    return;
                }

                const getAccessTokenResult = await client.mutate<{
                    refreshAccessToken: string | null;
                }>({
                    mutation: REFRESH_ACCESS_TOKEN,
                });

                const accessToken =
                    getAccessTokenResult.data?.refreshAccessToken;

                if (!accessToken) {
                    showInvalid();
                    return;
                }

                const payload = decodeAccessToken(accessToken);
                dispatch(setAccessToken(accessToken));
                dispatch(setUserId(payload.userId));
                dispatch(setName(payload.name));
                dispatch(setProfilePictureLink(payload.profilePictureLink));
            } catch (e) {
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
                console.log(e);
            } finally {
                setLoading(false);
            }
        },
        [client, dispatch, loading, showInvalid],
    );

    const handleSuccess = useCallback(
        async (credentialResponse: { credential?: string | undefined }) => {
            await getUserInfo(credentialResponse?.credential);
        },
        [getUserInfo],
    );

    return (
        <div
            ref={popupRef}
            className={`absolute w-max top-full right-1 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow z-50`}
            role='dialog'
            aria-label='login popup'>
            <p className='font-bold'>
                Đăng nhập để quản lý lịch trình của bạn!
            </p>
            <div className='flex mt-3 w-full justify-center align-middle'>
                <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
                    <GoogleLogin
                        use_fedcm_for_button={false}
                        use_fedcm_for_prompt={false}
                        onSuccess={handleSuccess}
                        onError={() => toast.error("Đăng nhập thất bại")}
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default LoginPopup;
