import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../hook.ts";
import { setShowEventDetailDialog } from "../../reducers/uiReducer.ts";
import { useCallback, useMemo } from "react";
import type { EventFromServer } from "../../type.ts";
import { formatDateTime } from "../../utils/miscs.ts";
import {
    getRecurrenceOptionFromRRule,
    getReminderOptionsFromKeys,
} from "../../utils/events.ts";

const ShowEventDetailDialog = () => {
    const showDialog = useAppSelector(
        (state) => state.ui.showEventDetailDialog,
    );
    const dispatch = useAppDispatch();

    const event = useAppSelector((state) => state.ui.eventToShowDetail) as
        | EventFromServer
        | undefined;

    const closeDialog = useCallback(() => {
        dispatch(setShowEventDetailDialog(false));
    }, [dispatch]);

    const startDateTime = useMemo(() => {
        if (!event) return null;
        return new Date(event.startDateTime);
    }, [event]);

    const endDateTime = useMemo(() => {
        if (!event) return null;
        return new Date(event.endDateTime);
    }, [event]);

    const recurrenceInfo = useMemo(() => {
        if (!event) return null;
        return getRecurrenceOptionFromRRule(event.rruleString);
    }, [event]);

    const reminders = useMemo(() => {
        if (!event) return [];
        return getReminderOptionsFromKeys(event.reminder);
    }, [event]);

    if (!event) return null;

    return (
        <Dialog
            open={showDialog}
            onClose={closeDialog}
            className='relative z-50 dark:text-gray-200'>
            <DialogBackdrop className='fixed inset-0 bg-black/50' />
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='space-y-4 bg-white px-8 py-6 rounded-xl w-xl dark:bg-gray-800'>
                    <div className='grid grid-cols-[auto_1fr_auto]'>
                        <div></div>
                        <DialogTitle className='font-bold text-2xl text-center self-center'>
                            Chi tiết sự kiện
                        </DialogTitle>
                    </div>

                    <div className='w-full space-y-4'>
                        <div className='w-full'>
                            <label className='text-lg font-bold text-gray-700 dark:text-gray-300'>
                                Tiêu đề
                            </label>
                            <div className='mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                {event.title}
                            </div>
                        </div>

                        {event.place && (
                            <div className='w-full'>
                                <label className='text-lg font-bold text-gray-700 dark:text-gray-300'>
                                    Địa điểm
                                </label>
                                <div className='mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                    {event.place}
                                </div>
                            </div>
                        )}

                        <fieldset>
                            <legend className='text-lg font-bold text-gray-700 dark:text-gray-300'>
                                Thời gian
                            </legend>
                            <div className='grid grid-cols-2 my-2 text-lg gap-2'>
                                <label className='text-gray-700 dark:text-gray-300'>
                                    Bắt đầu
                                </label>
                                <div className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                    {startDateTime
                                        ? formatDateTime(startDateTime)
                                        : ""}
                                </div>

                                <label className='text-gray-700 dark:text-gray-300'>
                                    Kết thúc
                                </label>
                                <div className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                    {endDateTime
                                        ? formatDateTime(endDateTime)
                                        : ""}
                                </div>

                                <label className='text-gray-700 dark:text-gray-300'>
                                    Lặp lại
                                </label>
                                <div className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                    {recurrenceInfo?.freq.value || "Không"}
                                </div>

                                {recurrenceInfo &&
                                    recurrenceInfo.freq.key !== "none" && (
                                        <>
                                            <label className='text-gray-700 dark:text-gray-300'>
                                                Giới hạn lặp
                                            </label>
                                            <div className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                                {recurrenceInfo.repeatLimit
                                                    .value || "Không"}
                                            </div>
                                        </>
                                    )}

                                {recurrenceInfo &&
                                    recurrenceInfo.freq.key !== "none" &&
                                    recurrenceInfo.repeatLimit.key ===
                                        "untilDate" &&
                                    recurrenceInfo.untilDate && (
                                        <>
                                            <label className='text-gray-700 dark:text-gray-300'>
                                                Đến ngày
                                            </label>
                                            <div className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                                {formatDateTime(
                                                    recurrenceInfo.untilDate,
                                                )}
                                            </div>
                                        </>
                                    )}

                                {recurrenceInfo &&
                                    recurrenceInfo.freq.key !== "none" &&
                                    recurrenceInfo.repeatLimit.key ===
                                        "numOccurrence" &&
                                    recurrenceInfo.numOccurrence && (
                                        <>
                                            <label className='text-gray-700 dark:text-gray-300'>
                                                Số lần lặp
                                            </label>
                                            <div className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                                {recurrenceInfo.numOccurrence}
                                            </div>
                                        </>
                                    )}

                                {recurrenceInfo &&
                                    (recurrenceInfo.freq.key ===
                                        "every-month" ||
                                        recurrenceInfo.freq.key ===
                                            "every-year") && (
                                        <>
                                            <label className='text-gray-700 dark:text-gray-300'>
                                                Lặp theo âm lịch
                                            </label>
                                            <div className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                                {recurrenceInfo.repeatByLunar
                                                    ? "Có"
                                                    : "Không"}
                                            </div>
                                        </>
                                    )}
                            </div>
                        </fieldset>

                        {event.description && (
                            <div className='w-full'>
                                <label className='text-lg font-bold text-gray-700 dark:text-gray-300'>
                                    Mô tả
                                </label>
                                <div className='mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 whitespace-pre-wrap min-h-25'>
                                    {event.description}
                                </div>
                            </div>
                        )}

                        {reminders.length > 0 && (
                            <div className='w-full'>
                                <label className='text-lg font-bold text-gray-700 dark:text-gray-300'>
                                    Nhắc nhở
                                </label>
                                <div className='mt-2 space-y-2'>
                                    {reminders.map((rem, idx) => (
                                        <div
                                            key={rem?.key ?? idx}
                                            className='px-3 py-1 bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600'>
                                            {rem?.value || ""}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='flex justify-end gap-4 mt-4'>
                            <button
                                className='py-2 px-4 bg-gray-200 rounded-lg hover:cursor-pointer hover:bg-gray-300 font-bold dark:bg-gray-600 dark:hover:bg-gray-700'
                                onClick={closeDialog}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default ShowEventDetailDialog;
