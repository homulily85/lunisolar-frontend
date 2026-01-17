import { type RefObject } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { OAUTH_CLIENT_ID } from "../../config.ts";

const LoginPopup = ({
    popupRef,
}: {
    popupRef: RefObject<HTMLDivElement | null>;
}) => {
    return (
        <div
            ref={popupRef}
            className={`absolute w-max top-full right-1 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow z-50`}>
            <p className='font-bold'>
                Đăng nhập để quản lý các sự kiện của bạn!
            </p>
            <div className='flex mt-3 w-full justify-center align-middle'>
                <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            console.log(credentialResponse.credential);
                        }}></GoogleLogin>
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default LoginPopup;
