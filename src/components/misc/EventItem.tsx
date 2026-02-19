import { type EventFromServer } from "../../type.ts";

import { formatDateTime } from "../../utils/miscs.ts";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useAppDispatch } from "../../hook.ts";
import { useCallback } from "react";
import Icon from "@mdi/react";
import { mdiDelete, mdiInformation } from "@mdi/js";
import {
    setEventTobeDeleted,
    setEventToShowDetail,
    setShowDeleteOptionDialog,
    setShowEventDetailDialog,
} from "../../reducers/uiReducer.ts";

const EventItem = ({ event }: { event: EventFromServer }) => {
    const label = `${event.title}\n${formatDateTime(new Date(event.startDateTime))} - ${formatDateTime(new Date(event.endDateTime))}`;
    const dispatch = useAppDispatch();
    const handleDelete = useCallback(() => {
        dispatch(setEventTobeDeleted(event));
        dispatch(setShowDeleteOptionDialog(true));
    }, [dispatch, event]);

    const handleShowDetail = useCallback(() => {
        dispatch(setEventToShowDetail(event));
        dispatch(setShowEventDetailDialog(true));
    }, [dispatch, event]);

    return (
        <Popover className='relative'>
            <PopoverButton
                aria-label={event.title}
                title={label}
                id={event.id}
                className='hover:cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-100 w-full focus:outline-none flex items-center px-2 py-2'>
                <p className='truncate text-left m-0 w-full'>{event.title}</p>
            </PopoverButton>

            <PopoverPanel anchor={{ to: "right", gap: "1rem" }}>
                <div
                    className={`px-2 py-1 ml-2 bg-white dark:bg-gray-700 rounded-md shadow z-50 border-2 border-gray-300 dark:border-gray-500
            w-100 max-h-50 dark:text-white`}
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
                            onClick={handleShowDetail}
                            aria-label='Chi tiết sự kiện'
                            title='Chi tiết sự kiện'
                            className='hover:cursor-pointer dark:hover:bg-gray-600  hover:bg-gray-100 rounded-md'>
                            <div className='flex justify-center'>
                                <Icon path={mdiInformation} size={1} />
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
            </PopoverPanel>
        </Popover>
    );
};

export default EventItem;
