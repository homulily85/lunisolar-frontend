import {
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { useCallback, useMemo } from "react";
import { setShowDeleteOptionDialog } from "../reducers/uiReducer.ts";
import { useAppDispatch, useAppSelector } from "../hook.ts";
import { deleteOptions } from "../utils/misc.ts";
import { deleteEvent, updateAnEvent } from "../services/eventService.ts";
import type { EventFromServer } from "../type.ts";
import { toast } from "react-toastify";
import { removeEvent, updateEvent } from "../reducers/eventsReducer.ts";
import { excludeADateFromRrule, setEndDateForRrule } from "../utils/events.ts";

const DeleteEventDialog = () => {
    const dispatch = useAppDispatch();
    const showDialog = useAppSelector(
        (state) => state.ui.showDeleteOptionDialog,
    );
    const currentDate = useAppSelector(
        (state) => state.date.currentSelectedSolarDate,
    );

    const eventsList = useAppSelector((state) => state.events);
    const eventTobeDeleted = useAppSelector(
        (state) => state.ui.eventTobeDeleted,
    ) as EventFromServer | undefined;

    const recurrenceCount = useMemo(() => {
        return eventsList.filter(
            (e) => e.id.split("_")[0] === eventTobeDeleted?.id?.split("_")[0],
        ).length;
    }, [eventTobeDeleted?.id, eventsList]);

    const closeDialog = useCallback(() => {
        dispatch(setShowDeleteOptionDialog(false));
    }, [dispatch]);

    // Normalize current date to timestamp to avoid repeated conversions
    const currentTs = useMemo(() => {
        return typeof currentDate === "number"
            ? currentDate
            : new Date(currentDate).getTime();
    }, [currentDate]);

    const prepareAndUpdate = useCallback(
        async (ogEvent: EventFromServer, newRrule: string) => {
            const newEvent = {
                ...ogEvent,
                rruleString: newRrule,
                id: ogEvent.id,
            };

            // @ts-expect-error backend expects no __typename
            delete newEvent.__typename;

            await updateAnEvent({
                ...newEvent,
                startDateTime: new Date(newEvent.startDateTime).toISOString(),
                endDateTime: new Date(newEvent.endDateTime).toISOString(),
            });

            return newEvent;
        },
        [],
    );

    const handleDelete = useCallback(
        async (deleteOption: string) => {
            if (!eventTobeDeleted) {
                dispatch(setShowDeleteOptionDialog(false));
                return;
            }

            try {
                dispatch(setShowDeleteOptionDialog(false));

                if (deleteOption === "cancel") return;

                if (deleteOption === "all") {
                    await deleteEvent(eventTobeDeleted);
                    dispatch(removeEvent(eventTobeDeleted));
                    return;
                }

                // For options that modify the recurring master event
                const baseId = eventTobeDeleted.id.split("_")[0];
                const ogEvent = eventsList.find((e) => e.id === baseId) as
                    | EventFromServer
                    | undefined;

                if (!ogEvent) {
                    toast.error("Sự kiện gốc không tìm thấy.");
                    return;
                }

                if (deleteOption === "subsequent") {
                    const newRrule = setEndDateForRrule(
                        ogEvent.rruleString,
                        new Date(currentTs - 24 * 60 * 60 * 1000),
                    );
                    const updated = await prepareAndUpdate(ogEvent, newRrule);

                    dispatch(
                        updateEvent({
                            ...eventTobeDeleted,
                            rruleString: updated.rruleString,
                            id: baseId,
                        }),
                    );
                    return;
                }

                if (deleteOption === "current") {
                    const newRrule = excludeADateFromRrule(
                        ogEvent.rruleString,
                        new Date(currentTs),
                    );
                    const updated = await prepareAndUpdate(ogEvent, newRrule);

                    dispatch(
                        updateEvent({
                            ...eventTobeDeleted,
                            rruleString: updated.rruleString,
                            id: baseId,
                        }),
                    );
                    return;
                }
            } catch (e) {
                console.log(e);
                toast.error("Có lỗi xảy ra!");
            }
        },
        [currentTs, dispatch, eventTobeDeleted, eventsList, prepareAndUpdate],
    );

    if (!eventTobeDeleted?.rruleString || recurrenceCount <= 2) {
        return (
            <Dialog
                open={showDialog}
                onClose={closeDialog}
                className='relative z-50 dark:text-gray-200'>
                <DialogBackdrop className='fixed inset-0 bg-black/50' />
                <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                    <DialogPanel className='space-y-4 bg-white px-8 py-6 rounded-xl  dark:bg-gray-800'>
                        <DialogTitle className='font-bold text-2xl text-center self-center'>
                            Xóa sự kiện?
                        </DialogTitle>
                        <Description className='text-center flex flex-col gap-2'>
                            Bạn có muốn có muốn xóa sự kiện đã chọn không?
                            <button
                                onClick={() => handleDelete("all")}
                                key='yes'
                                className='font-bold py-2 rounded-xl hover:cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100'>
                                Có
                            </button>
                            <button
                                onClick={() => handleDelete("cancel")}
                                key='no'
                                className='font-bold py-2 rounded-xl hover:cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100'>
                                Không
                            </button>
                        </Description>
                    </DialogPanel>
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={showDialog}
            onClose={closeDialog}
            className='relative z-50 dark:text-gray-200'>
            <DialogBackdrop className='fixed inset-0 bg-black/50' />
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='space-y-4 bg-white px-8 py-6 rounded-xl  dark:bg-gray-800'>
                    <DialogTitle className='font-bold text-2xl text-center self-center'>
                        Xóa nhiều sự kiện?
                    </DialogTitle>
                    <Description className='text-center flex flex-col gap-2'>
                        Sự kiện bạn đã chọn được lặp lại. Bạn muốn xóa:
                        {deleteOptions.map(({ key, value }) => {
                            return (
                                <button
                                    onClick={() => handleDelete(key)}
                                    key={key}
                                    className='font-bold py-2 rounded-xl hover:cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100'>
                                    {value}
                                </button>
                            );
                        })}
                    </Description>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default DeleteEventDialog;
