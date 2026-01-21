import { type RefObject, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hook.ts";
import { mdiLogout } from "@mdi/js";
import Icon from "@mdi/react";
import {
    setAccessToken,
    setName,
    setProfilePictureLink,
    setUserId,
} from "../../reducers/userReducer.ts";
import { logout } from "../../services/authenticationService.ts";

const SettingPopup = ({
    popupRef,
}: {
    popupRef: RefObject<HTMLDivElement | null>;
}) => {
    const { name, profilePictureLink } = useAppSelector((s) => s.user);
    const dispatch = useAppDispatch();
    const handleLogout = useCallback(async () => {
        dispatch(setAccessToken(""));
        dispatch(setName(""));
        dispatch(setUserId(""));
        dispatch(setProfilePictureLink(""));
        await logout();
    }, [dispatch]);

    return (
        <div
            ref={popupRef}
            className={`absolute w-max top-full right-1 px-6 py-6 bg-white dark:bg-gray-700 rounded-md shadow z-50`}
            role='dialog'
            aria-label='login popup'>
            <div className='flex justify-center'>
                <img
                    src={profilePictureLink}
                    alt="user's profile picture"
                    width={96}
                    className='rounded-full'
                />
            </div>
            <p className='font-bold mt-2 text-xl'>Xin chào {name}!</p>
            <div className='flex mt-2 w-full justify-center'>
                <button
                    onClick={handleLogout}
                    className='w-full font-bold hover:bg-gray-100 hover:cursor-pointer active:bg-gray-200 rounded-xl border py-2 px-8 border-gray-400 dark:hover:bg-gray-800 dark:active:bg-gray-900'>
                    <Icon path={mdiLogout} size={1} className='inline mr-2' />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default SettingPopup;
