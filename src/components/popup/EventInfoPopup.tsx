import type { RefObject } from "react";
import type { EventFromServer } from "../../type.ts";
import { formatDateTime } from "../../utils/misc.ts";

const EventInfoPopup = ({
    event,
    popupRef,
}: {
    event: EventFromServer;
    popupRef: RefObject<HTMLDivElement | null>;
}) => {
    return (
        <div
            ref={popupRef}
            className={`absolute px-2 py-1 left-full -top-5 ml-2 bg-white dark:bg-gray-700 rounded-md shadow z-50 border-2 border-gray-300 dark:border-gray-500
            w-100 max-h-50`}
            role='dialog'>
            <p
                className='font-bold mt-1 text-xl text-center my-2 truncate'
                aria-label={event.title}
                title={event.title}>
                {event.title}
            </p>
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
