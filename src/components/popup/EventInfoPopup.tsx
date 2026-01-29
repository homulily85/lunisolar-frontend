import { type RefObject, useCallback } from "react";
import type { EventFromServer } from "../../type.ts";
import { formatDateTime } from "../../utils/misc.ts";
import Icon from "@mdi/react";
import { mdiCalendarEdit, mdiDelete } from "@mdi/js";
import { deleteEvent } from "../../services/eventService.ts";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hook.ts";
import { removeEvent } from "../../reducers/eventsReducer.ts";

const EventInfoPopup = ({
    event,
    popupRef,
}: {
    event: EventFromServer;
    popupRef: RefObject<HTMLDivElement | null>;
}) => {
    const dispatch = useAppDispatch();
    const handleDelete = useCallback(async () => {
        const ok = confirm(
            `Bạn có chắc chắn muốn xóa sự kiện ${event.title} không?`,
        );
        if (!ok) {
            return;
        }
        try {
            await deleteEvent(event);
            dispatch(removeEvent(event));
        } catch (e) {
            console.log(e);
            toast.error("Có lỗi xảy ra!");
        }
    }, [dispatch, event]);

    return (
        <div
            ref={popupRef}
            className={`absolute px-2 py-1 left-full -top-5 ml-2 bg-white dark:bg-gray-700 rounded-md shadow z-50 border-2 border-gray-300 dark:border-gray-500
            w-100 max-h-50`}
            role='dialog'>
            <div className='grid grid-cols-[1fr_8fr_1fr]'>
                <button
                    onClick={handleDelete}
                    aria-label='Xóa sự kiện'
                    title='Xóa sự kiện'
                    className='hover:cursor-pointer dark:hover:bg-gray-600  hover:bg-gray-100 rounded-md'>
                    <div className='flex justify-center'>
                        <Icon path={mdiDelete} size={1} />
                    </div>
                </button>

                <p
                    className='font-bold mt-1 text-xl text-center my-2 truncate'
                    aria-label={event.title}
                    title={event.title}>
                    {event.title}
                </p>

                <button
                    aria-label='Cập nhật sự kiện'
                    title='Cập nhật sự kiện'
                    className='hover:cursor-pointer dark:hover:bg-gray-600  hover:bg-gray-100 rounded-md'>
                    <div className='flex justify-center'>
                        <Icon path={mdiCalendarEdit} size={1} />
                    </div>
                </button>
            </div>
            <p className='text-center my-1'>{`${formatDateTime(new Date(event.startDateTime))} - ${formatDateTime(new Date(event.endDateTime))}`}</p>{" "}
            {event.place && event.place.length > 0 && (
                <p
                    className='my-1 text-center truncate'
                    aria-label={event.place}
                    title={event.place}>
                    {event.place}
                </p>
            )}
            <div className='border-t-gray-300 dark:border-t-gray-600 border-t-2 py-2'>
                {event.description && event.description.length > 0 ? (
                    <p
                        className='line-clamp-4 wrap-break-word whitespace-normal'
                        aria-label={event.description}
                        title={event.description}>
                        {event.description}
                    </p>
                ) : (
                    <p className='text-center'>
                        <i>Không có mô tả</i>
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventInfoPopup;
