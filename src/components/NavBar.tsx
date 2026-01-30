import { useCallback, useMemo, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight, mdiLogout } from "@mdi/js";
import { useAppDispatch, useAppSelector } from "../hook.ts";
import { setCurrentSelectedSolarDate } from "../reducers/dateReducer.ts";
import { decodeAccessToken, monthNames } from "../utils/misc.ts";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
    setAccessToken,
    setId,
    setName,
    setProfilePictureLink,
} from "../reducers/userReducer.ts";
import {
    auth,
    getAccessToken,
    logout,
} from "../services/authenticationService.ts";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { OAUTH_CLIENT_ID } from "../config.ts";

const ICON_SIZE = 1.25;

const NavBar = () => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    const { accessToken, profilePictureLink, name } = useAppSelector(
        (s) => s.user,
    );
    const selectedTs = useAppSelector((s) => s.date.currentSelectedSolarDate);
    const todayTs = useAppSelector((s) => s.date.today);
    const dispatch = useAppDispatch();

    const handleLogout = useCallback(async () => {
        dispatch(setAccessToken(""));
        dispatch(setName(""));
        dispatch(setId(""));
        dispatch(setProfilePictureLink(""));
        await logout();
    }, [dispatch]);
    const selectedDate = useMemo(() => new Date(selectedTs), [selectedTs]);

    const label = useMemo(
        () =>
            `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`,
        [selectedDate],
    );

    const changeMonth = useCallback(
        (delta: number) => {
            const d = new Date(selectedTs);
            d.setMonth(d.getMonth() + delta);
            dispatch(setCurrentSelectedSolarDate(d.getTime()));
        },
        [dispatch, selectedTs],
    );

    const jumpToToday = useCallback(() => {
        dispatch(setCurrentSelectedSolarDate(todayTs));
    }, [dispatch, todayTs]);

    const showInvalid = useCallback(() => {
        toast.error("Chứng chỉ không hợp lệ!");
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
                if (!(await auth(credential))) {
                    showInvalid();
                    return;
                }

                const accessToken = await getAccessToken();
                if (!accessToken) {
                    showInvalid();
                    return;
                }

                const payload = decodeAccessToken(accessToken);
                dispatch(setAccessToken(accessToken));
                dispatch(setId(payload.id));
                dispatch(setName(payload.name));
                dispatch(setProfilePictureLink(payload.profilePictureLink));
            } catch (e) {
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
                console.log(e);
            } finally {
                setLoading(false);
            }
        },
        [dispatch, loading, showInvalid],
    );

    const handleSuccess = useCallback(
        async (credentialResponse: { credential?: string | undefined }) => {
            await getUserInfo(credentialResponse?.credential);
        },
        [getUserInfo],
    );

    return (
        <div className='p-4 flex justify-between dark:bg-gray-800 dark:text-white'>
            <div className='flex justify-center items-center gap-2'>
                <button
                    aria-label='Tháng trước'
                    title='Tháng trước'
                    className='hover:bg-gray-100 active:bg-gray-200 hover:cursor-pointer dark:hover:bg-gray-700 dark:active:bg-gray-800 rounded-full p-2 flex items-center justify-center'
                    onClick={() => changeMonth(-1)}>
                    <Icon path={mdiChevronLeft} size={ICON_SIZE} />
                </button>

                <p className='text-2xl font-bold w-70 text-center'>{label}</p>

                <button
                    aria-label='Tháng sau'
                    title='Tháng sau'
                    className='hover:bg-gray-100 active:bg-gray-200  hover:cursor-pointer dark:hover:bg-gray-700 dark:active:bg-gray-800 rounded-full p-2 flex items-center justify-center'
                    onClick={() => changeMonth(1)}>
                    <Icon path={mdiChevronRight} size={ICON_SIZE} />
                </button>

                <button
                    onClick={jumpToToday}
                    className='font-bold hover:bg-gray-100 hover:cursor-pointer active:bg-gray-200 rounded-xl border py-2 px-8 border-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-800'
                    aria-label='Hôm nay'
                    title='Hôm nay'>
                    Hôm nay
                </button>
            </div>

            {!accessToken && (
                <Popover className='relative'>
                    <PopoverButton className=' focus:outline-none hover:cursor-pointer hover:bg-orange-700 active:bg-orange-800 rounded-lg flex items-center justify-center px-4 py-2 text-white font-bold'>
                        Đăng nhập
                    </PopoverButton>

                    <PopoverPanel>
                        <div
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
                                        onError={() =>
                                            toast.error("Đăng nhập thất bại")
                                        }
                                    />
                                </GoogleOAuthProvider>
                            </div>
                        </div>
                    </PopoverPanel>
                </Popover>
            )}

            {accessToken && (
                <Popover className='relative'>
                    <PopoverButton className='hover:cursor-pointer focus:outline-none'>
                        <img
                            src={profilePictureLink}
                            alt="user's profile picture"
                            width={48}
                            className='rounded-full'
                        />
                    </PopoverButton>

                    <PopoverPanel>
                        <div
                            ref={popupRef}
                            className={`absolute w-max top-full right-1 px-6 py-6 bg-white dark:bg-gray-700 rounded-md shadow z-50`}
                            aria-label='login popup'>
                            <div className='flex justify-center'>
                                <img
                                    src={profilePictureLink}
                                    alt="user's profile picture"
                                    width={96}
                                    className='rounded-full'
                                />
                            </div>
                            <p className='font-bold mt-2 text-xl'>
                                Xin chào {name}!
                            </p>
                            <div className='flex mt-2 w-full justify-center'>
                                <button
                                    onClick={handleLogout}
                                    className='w-full font-bold hover:bg-gray-100 hover:cursor-pointer active:bg-gray-200 rounded-xl border py-2 px-8 border-gray-400 dark:hover:bg-gray-800 dark:active:bg-gray-900'>
                                    <Icon
                                        path={mdiLogout}
                                        size={1}
                                        className='inline mr-2'
                                    />
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </PopoverPanel>
                </Popover>
            )}
        </div>
    );
};

export default NavBar;
