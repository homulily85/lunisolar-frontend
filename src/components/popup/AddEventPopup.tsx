import {
    type Dispatch,
    type MouseEvent,
    type RefObject,
    type SetStateAction,
    useCallback,
    useLayoutEffect,
    useState,
} from "react";
import { useAppDispatch } from "../../hook.ts";
import { setShowAddEventDialog } from "../../reducers/uiReducer.ts";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";

const AddEventPopup = ({
    popupRef,
    setOpen,
}: {
    popupRef: RefObject<HTMLDivElement | null>;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const dispatch = useAppDispatch();
    const [flip, setFlip] = useState(false);

    const onClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            dispatch(setShowAddEventDialog(true));
            setOpen(false);
        },
        [dispatch, setOpen],
    );

    useLayoutEffect(() => {
        const el = popupRef?.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();

        const overflowRight = rect.right > window.innerWidth;

        if (overflowRight) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFlip(true);
        }
    }, [popupRef]);

    return (
        <div
            ref={popupRef}
            className={`absolute w-max ${flip ? "right-full mr-1" : "left-full ml-1"} bg-white hover:bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-600 rounded shadow z-50`}>
            <button className='w-full h-full p-3' onClick={onClick}>
                <Icon path={mdiPlus} size={1} className='inline pb-1' />
                Thêm sự kiện
            </button>
        </div>
    );
};

export default AddEventPopup;
