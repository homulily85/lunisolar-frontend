import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Switch,
} from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../hook.ts";
import { setShowAddEventDialog } from "../../reducers/uiReducer.ts";
import {
    type ChangeEvent,
    Fragment,
    useCallback,
    useEffect,
    useState,
} from "react";
import TimePicker from "./TimePicker.tsx";
import DatePicker from "./DatePicker.tsx";
import { mdiChevronDown, mdiDelete, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { toast } from "react-toastify";
import { z } from "zod";
import type { Option } from "../../type.ts";
import { frequency, reminderTime, repeatLimits } from "../../utils/misc.ts";
import { addNewEvent } from "../../services/eventService.ts";
import { addEvent } from "../../reducers/eventsReducer.ts";
import { createRruleString } from "../../utils/events.ts";

const EMPTY_REMINDER: Option = {
    key: "",
    value: "Chọn thời điểm",
};

const AddNewEvent = () => {
    const selectedTs = useAppSelector((s) => s.date.currentSelectedSolarDate);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

    const [isAllDay, setIsAllDay] = useState(false);

    const [selectedStartDate, setSelectedStartDate] = useState<Date>(
        new Date(selectedTs),
    );
    const [selectedStartTime, setSelectedStartTime] = useState("00:00");
    const [selectedEndTime, setSelectedEndTime] = useState("00:00");
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(
        new Date(selectedTs),
    );

    const [selectedRepeat, setSelectedRepeat] = useState<Option>(frequency[0]);

    const [repeatLimit, setRepeatLimit] = useState<Option>(repeatLimits[0]);

    const [numOccurrence, setNumOccurrence] = useState<number | string>(1);

    const [untilDate, setUntilDate] = useState<Date>(new Date(selectedTs));

    const [description, setDescription] = useState("");

    const [selectedReminders, setSelectedReminders] = useState<
        (Option | null)[]
    >([]);

    const showDialog = useAppSelector((state) => state.ui.showAddEventDialog);
    const dispatch = useAppDispatch();

    const resetDialog = useCallback(() => {
        setTitle("");
        setLocation("");
        setIsAllDay(false);
        setSelectedRepeat(frequency[0]);
        setRepeatLimit(repeatLimits[0]);
        setNumOccurrence(1);
        setSelectedReminders([]);
        setDescription("");
        setSelectedStartTime("00:00");
        setSelectedEndTime("00:00");
    }, []);

    const closeDialog = useCallback(() => {
        dispatch(setShowAddEventDialog(false));
        resetDialog();
    }, [dispatch, resetDialog]);

    const addReminder = useCallback(() => {
        setSelectedReminders((prev) => [...prev, null]);
    }, []);

    const updateReminder = useCallback(
        (index: number, value: Option | null) => {
            setSelectedReminders((prev) => {
                const next = prev.slice();
                next[index] = value;
                return next;
            });
        },
        [],
    );

    const removeReminder = useCallback((index: number) => {
        setSelectedReminders((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const availableReminderOptions = useCallback(
        (currentIndex: number) => {
            const selectedKeys = new Set(
                selectedReminders
                    .map((r, i) => (i !== currentIndex ? r?.key : undefined))
                    .filter(Boolean),
            );
            return reminderTime.filter((r) => !selectedKeys.has(r.key));
        },
        [selectedReminders],
    );

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (val === "") {
            setNumOccurrence("");
        } else {
            setNumOccurrence(Number(val));
        }
    }, []);

    const handleBlur = useCallback(() => {
        if (numOccurrence === "" || Number(numOccurrence) < 1) {
            setNumOccurrence(1);
        }
    }, [numOccurrence]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedStartDate(new Date(selectedTs));
        setSelectedEndDate(new Date(selectedTs));
        setUntilDate(new Date(selectedTs));
    }, [selectedTs]);

    const saveNewEvent = async () => {
        if (title.trim() === "") {
            toast.error("Trường tiêu đề không được trống!");
            return;
        }

        const startTimeParsed = z.iso.time().safeParse(selectedStartTime);
        if (!startTimeParsed.success) {
            toast.error("Thời gian bắt đầu không hợp lệ!");
            return;
        }

        const endTimeParsed = z.iso.time().safeParse(selectedEndTime);
        if (!endTimeParsed.success) {
            toast.error("Thời gian kết thúc không hợp lệ!");
            return;
        }

        const startDateTime = new Date(
            selectedStartDate.getFullYear(),
            selectedStartDate.getMonth(),
            selectedStartDate.getDate(),
            ...startTimeParsed.data.split(":").map(Number),
        );

        let endDateTime;

        if (!isAllDay) {
            endDateTime = new Date(
                selectedEndDate.getFullYear(),
                selectedEndDate.getMonth(),
                selectedEndDate.getDate(),
                ...endTimeParsed.data.split(":").map(Number),
            );
        } else {
            endDateTime = new Date(
                selectedEndDate.getFullYear(),
                selectedEndDate.getMonth(),
                selectedEndDate.getDate(),
                23,
                59,
                59,
            );
        }

        if (startDateTime > endDateTime) {
            toast.error("Thời điểm kết thúc phải lớn hơn thời điểm bắt đầu!");
            return;
        }

        for (const reminder of selectedReminders) {
            if (!reminder) {
                toast.error("Bạn cần chọn thời điểm nhắc nhớ!");
                return;
            }
        }

        let rruleString = "";

        if (repeatLimit.key === "none") {
            rruleString = createRruleString(selectedRepeat.key, startDateTime);
        } else if (repeatLimit.key === "untilDate") {
            if (untilDate < startDateTime) {
                toast.error("Ngày kết thúc lặp phải sau ngày bắt đầu!");
                return;
            }
            rruleString = createRruleString(selectedRepeat.key, startDateTime, {
                untilDate,
            });
        } else if (repeatLimit.key === "numOccurrence") {
            const num =
                typeof numOccurrence === "string"
                    ? Number(numOccurrence)
                    : numOccurrence;

            if (num < 1) {
                toast.error("Số lần lặp phải lớn hơn 0!");
                return;
            }
            rruleString = createRruleString(selectedRepeat.key, startDateTime, {
                numOccurrence: num,
            });
        }

        try {
            const eventId = await addNewEvent({
                title: title.trim(),
                place: location,
                isAllDay: isAllDay,
                startDateTime: startDateTime.toISOString(),
                endDateTime: endDateTime.toISOString(),
                description: description,
                reminder: selectedReminders
                    .filter((r) => r !== null)
                    .map((r) => r.key),
                rruleString: rruleString,
            });

            dispatch(
                addEvent({
                    id: eventId,
                    place: location,
                    title: title.trim(),
                    isAllDay: isAllDay,
                    startDateTime: startDateTime.getTime(),
                    endDateTime: endDateTime.getTime(),
                    description: description,
                    reminder: selectedReminders
                        .filter((r) => r !== null)
                        .map((r) => r.key),
                    rruleString: rruleString,
                }),
            );

            closeDialog();
        } catch (e) {
            toast.error("Có lỗi xảy ra khi tạo sự kiện mới");
            console.log(e);
            return;
        }
    };

    return (
        <Dialog
            open={showDialog}
            onClose={closeDialog}
            className='relative z-50 dark:text-gray-200'>
            <DialogBackdrop className='fixed inset-0 bg-black/50' />
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <DialogPanel className='space-y-4 bg-white px-8 py-6 rounded-xl w-xl dark:bg-gray-800'>
                    <div className='grid grid-cols-[auto_1fr_auto]'>
                        <button
                            className='py-2 px-4 bg-gray-200 rounded-lg hover:cursor-pointer hover:bg-gray-300 font-bold dark:bg-gray-600 dark:hover:bg-gray-700'
                            onClick={closeDialog}>
                            Hủy
                        </button>
                        <DialogTitle className='font-bold text-2xl text-center self-center'>
                            Sự kiện mới
                        </DialogTitle>
                        <button
                            className='py-2 px-4 bg-orange-200 rounded-lg  hover:cursor-pointerhover:bg-orange-300 font-bold dark:bg-orange-700 dark:hover:bg-orange-800'
                            onClick={() => {
                                void saveNewEvent();
                            }}>
                            Thêm
                        </button>
                    </div>

                    <form className='w-full'>
                        <div className='relative w-full'>
                            <input
                                value={title}
                                onChange={({ target }) => {
                                    setTitle(target.value);
                                }}
                                type='text'
                                id='title'
                                required
                                placeholder=' '
                                className='peer w-full border border-gray-300 rounded px-3 pt-4 pb-2 text-lg focus:outline-none focus:border-orange-300 dark:border-gray-500'
                            />
                            <label
                                htmlFor='title'
                                className='absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:text-sm peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-sm peer-focus:translate-y-0 dark:bg-gray-800 dark:text-gray-200'>
                                Tiêu đề
                            </label>
                        </div>

                        <div className='relative w-full my-4'>
                            <input
                                value={location}
                                onChange={({ target }) => {
                                    setLocation(target.value);
                                }}
                                type='text'
                                id='location'
                                placeholder=' '
                                className='peer w-full border border-gray-300 rounded px-3 pt-4 pb-2 text-lg focus:outline-none focus:border-orange-300 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-sm dark:border-gray-500'
                            />
                            <label
                                htmlFor='location'
                                className='absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:text-sm peer-focus:translate-y-0 dark:bg-gray-800 dark:text-gray-200'>
                                Địa điểm
                            </label>
                        </div>

                        <fieldset className='my-4'>
                            <legend className='text-lg font-bold'>
                                Thời gian
                            </legend>
                            <div className='grid grid-cols-2 my-2 text-lg gap-1 '>
                                <label> Cả ngày </label>
                                <Switch
                                    checked={isAllDay}
                                    onChange={setIsAllDay}
                                    className='group inline-flex justify-self-end h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition data-checked:bg-orange-400'>
                                    <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6' />
                                </Switch>

                                <label className='self-center'>Bắt đầu</label>
                                <div className='grid grid-cols-2 gap-2'>
                                    {!isAllDay && (
                                        <TimePicker
                                            name='start-time'
                                            id='start-time'
                                            value={selectedStartTime}
                                            setValue={setSelectedStartTime}
                                            className='justify-self-end'
                                        />
                                    )}
                                    <div className='col-start-2 col-end-3 justify-self-end'>
                                        <DatePicker
                                            value={selectedStartDate}
                                            setValue={setSelectedStartDate}
                                        />
                                    </div>
                                </div>

                                <label className='self-center'>Kết thúc</label>
                                <div className='grid grid-cols-2 gap-2'>
                                    {!isAllDay && (
                                        <TimePicker
                                            name='end-time'
                                            id='end-time'
                                            value={selectedEndTime}
                                            setValue={setSelectedEndTime}
                                            className='justify-self-end'
                                        />
                                    )}
                                    <div className='col-start-2 col-end-3 justify-self-end'>
                                        <DatePicker
                                            value={selectedEndDate}
                                            setValue={setSelectedEndDate}
                                        />
                                    </div>
                                </div>

                                <label className='self-center'>Lặp lại</label>
                                <Listbox
                                    value={selectedRepeat}
                                    onChange={setSelectedRepeat}>
                                    <ListboxButton className='relative block w-full py-1.5 pr-8 pl-1 text-left border-b border-b-orange-300 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'>
                                        {selectedRepeat.value}
                                        <Icon
                                            className='group pointer-events-none absolute top-2.5 right-2.5'
                                            path={mdiChevronDown}
                                            size={1}
                                        />
                                    </ListboxButton>
                                    <ListboxOptions
                                        anchor='bottom'
                                        className='w-(--button-width) border border-white/5 bg-gray-100 dark:bg-gray-700 [--anchor-gap:--spacing(1)] focus:outline-none'>
                                        {frequency.map((f) => (
                                            <ListboxOption
                                                key={f.key}
                                                value={f}
                                                className='group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-gray-200 dark:data-focus:bg-gray-600'>
                                                {f.value}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>

                                {selectedRepeat &&
                                    selectedRepeat.key !== "none" && (
                                        <>
                                            <label className='self-center'>
                                                Giới hạn lặp
                                            </label>
                                            <Listbox
                                                value={repeatLimit}
                                                onChange={setRepeatLimit}>
                                                <ListboxButton className='relative block w-full py-1.5 pr-8 pl-1 text-left border-b border-b-orange-300 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'>
                                                    {repeatLimit.value}
                                                    <Icon
                                                        className='group pointer-events-none absolute top-2.5 right-2.5'
                                                        path={mdiChevronDown}
                                                        size={1}
                                                    />
                                                </ListboxButton>
                                                <ListboxOptions
                                                    anchor='bottom'
                                                    className='w-(--button-width) border border-white/5 bg-gray-100 dark:bg-gray-700 [--anchor-gap:--spacing(1)] focus:outline-none'>
                                                    {repeatLimits.map((f) => (
                                                        <ListboxOption
                                                            key={f.key}
                                                            value={f}
                                                            className='group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-gray-200 dark:data-focus:bg-gray-600'>
                                                            {f.value}
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </Listbox>
                                        </>
                                    )}
                                {selectedRepeat &&
                                    selectedRepeat.key !== "none" &&
                                    repeatLimit.key === "untilDate" && (
                                        <>
                                            <label className='self-center'>
                                                Đến ngày
                                            </label>
                                            <DatePicker
                                                value={untilDate}
                                                setValue={setUntilDate}
                                            />
                                        </>
                                    )}

                                {selectedRepeat &&
                                    selectedRepeat.key !== "none" &&
                                    repeatLimit.key === "numOccurrence" && (
                                        <>
                                            <label className='self-center'>
                                                Số lần lặp
                                            </label>

                                            <input
                                                type='number'
                                                min={1}
                                                value={numOccurrence}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className='w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-orange-300 dark:border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                            />
                                        </>
                                    )}
                            </div>
                        </fieldset>

                        <div className='relative w-full my-4'>
                            <label
                                htmlFor='description'
                                className='text-lg font-bold'>
                                Mô tả
                            </label>
                            <textarea
                                value={description}
                                onChange={({ target }) => {
                                    setDescription(target.value);
                                }}
                                id='description'
                                placeholder=' '
                                className='peer w-full border border-gray-300 rounded px-3 pt-4 pb-2  focus:outline-none focus:border-orange-300 resize-none h-40!'
                            />
                        </div>

                        <div className='relative w-full my-4'>
                            <fieldset className='text-lg font-bold'>
                                Nhắc nhở
                            </fieldset>
                            <div className='grid grid-cols-[8fr_1fr] gap-2'>
                                {selectedReminders.map((rem, idx) => (
                                    <Fragment key={rem?.key ?? idx}>
                                        <div>
                                            <Listbox
                                                value={rem ?? EMPTY_REMINDER}
                                                onChange={(v) =>
                                                    updateReminder(idx, v)
                                                }>
                                                <ListboxButton className='relative block w-full py-1.5 pr-8 pl-1 text-left border-b border-b-orange-300 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'>
                                                    {
                                                        (rem ?? EMPTY_REMINDER)
                                                            .value
                                                    }
                                                    <Icon
                                                        className='group pointer-events-none absolute top-2.5 right-2.5'
                                                        path={mdiChevronDown}
                                                        size={1}
                                                    />
                                                </ListboxButton>
                                                <ListboxOptions
                                                    anchor='bottom'
                                                    className='w-(--button-width) border border-white/5 bg-gray-100 dark:bg-gray-700 [--anchor-gap:--spacing(1)] focus:outline-none'>
                                                    {availableReminderOptions(
                                                        idx,
                                                    ).map((r) => (
                                                        <ListboxOption
                                                            key={r.key}
                                                            value={r}
                                                            className='group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-gray-200 dark:data-focus:bg-gray-600'>
                                                            {r.value}
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </Listbox>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => removeReminder(idx)}
                                            className='p-1'>
                                            <Icon
                                                path={mdiDelete}
                                                size={1}
                                                className='justify-self-center self-center'
                                            />
                                        </button>
                                    </Fragment>
                                ))}

                                {selectedReminders.length < 3 && (
                                    <button
                                        type='button'
                                        onClick={addReminder}
                                        className='col-span-2 justify-self-center flex items-center gap-2 justify-center hover:cursor-pointer hover:bg-gray-200 py-2 w-max rounded-md px-2 dark:hover:bg-gray-700'>
                                        <Icon
                                            className='inline-block'
                                            path={mdiPlus}
                                            size={1}
                                        />
                                        Thêm lịch nhắc nhở
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default AddNewEvent;
