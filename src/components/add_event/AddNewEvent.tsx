import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Switch
} from '@headlessui/react';
import {useAppDispatch, useAppSelector} from '../../hook.ts';
import {setShowDialog} from '../../reducers/uiReducer.ts';
import {useState} from 'react';
import TimePicker from './TimePicker.tsx';
import DatePicker from './DatePicker.tsx';
import {mdiChevronDown, mdiDelete, mdiPlus} from '@mdi/js';
import Icon from '@mdi/react';

const frequency: Record<string, string>[] = [
    {key: 'none', value: 'Không'},
    {key: 'everyday', value: 'Hàng ngày'},
    {key: 'everyweek', value: 'Hàng tuần'},
    {key: 'every-two-weeks', value: 'Mỗi hai tuần'},
    {key: 'every-month', value: 'Hàng tháng'},
    {key: 'every-year', value: 'Hàng năm'},
];

const reminderTime: Record<string, string>[] = [
    {key: '5-min', value: 'Trước 5 phút'},
    {key: '10-min', value: 'Trước 10 phút'},
    {key: '15-min', value: 'Trước 15 phút'},
    {key: '30-min', value: 'Trước 30 phút'},
    {key: '1-hour', value: 'Trước 1 giờ'},
    {key: '2-hour', value: 'Trước 2 giờ'},
    {key: '6-hour', value: 'Trước 6 giờ'},
    {key: '12-hour', value: 'Trước 12 giờ'},
    {key: '1-day', value: 'Trước 1 ngày'},
    {key: '2-day', value: 'Trước 2 ngày'},
    {key: '3-day', value: 'Trước 3 ngày'},
    {key: '1-week', value: 'Trước 1 tuần'},
    {key: '2-week', value: 'Trước 2 tuần'},
    {key: '1-month', value: 'Trước 1 tháng'},
];

const EMPTY_REMINDER = {
    key: '',
    value: 'Chọn thời điểm',
};

const AddNewEvent = () => {
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState(frequency[0]);
    const [reminderCount, setRemindersCount] = useState(0);
    const [selectedReminder, setSelectedReminder] = useState<(Record<string, string> | null)[]>([]);

    const showDialog = useAppSelector(state => state.ui.showDialog);
    const dispatch = useAppDispatch();

    const onClose = () => {
        dispatch(setShowDialog(false));
    };

    return (
        <>
            <Dialog open={showDialog} onClose={onClose}
                    className="relative z-50 dark:text-gray-200">
                <DialogBackdrop className="fixed inset-0 bg-black/50"/>
                <div
                    className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel
                        className="space-y-4 bg-white px-8 py-6 rounded-xl w-xl dark:bg-gray-800">
                        <div className="grid grid-cols-[auto_1fr_auto]">
                            <button className="py-2 px-4 bg-gray-200 rounded-lg hover:bg-gray-300
                            font-bold dark:bg-gray-600 dark:hover:bg-gray-700"
                                    onClick={onClose}>
                                Hủy
                            </button>
                            <DialogTitle
                                className="font-bold text-2xl text-center self-center ">
                                Thêm sự kiện
                            </DialogTitle>
                            <button
                                className="py-2 px-4 bg-orange-300 rounded-lg hover:bg-orange-400
                                font-bold dark:bg-orange-700 dark:hover:bg-orange-800"
                                onClick={onClose}>Thêm
                            </button>

                        </div>
                        <form className="w-full">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded
                                    px-3 pt-4 pb-2 text-lg focus:outline-none focus:border-orange-300
                                    dark:border-gray-500 "
                                />

                                <label
                                    htmlFor="title"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all
                                    duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                                    peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:text-sm
                                    peer-not-placeholder-shown:-top-2
                                    peer-not-placeholder-shown:translate-y-0
                                    peer-not-placeholder-shown:text-sm
                                    peer-focus:translate-y-0 dark:bg-gray-800 dark:text-gray-200
                                    "
                                >
                                    Tiêu đề
                                </label>
                            </div>

                            <div className="relative w-full my-4">
                                <input
                                    type="text"
                                    id="location"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded
                                    px-3 pt-4 pb-2 text-lg focus:outline-none focus:border-orange-300
                                    peer-not-placeholder-shown:-top-2
                                    peer-not-placeholder-shown:translate-y-0
                                    peer-not-placeholder-shown:text-sm
                                    dark:border-gray-500"
                                />

                                <label
                                    htmlFor="location"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all
                                    duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                                    peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:text-sm
                                    peer-focus:translate-y-0 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    Địa điểm
                                </label>
                            </div>

                            <fieldset className="my-4">
                                <legend className="text-lg font-bold">Thời gian</legend>
                                <div className="grid grid-cols-2 my-2 text-lg gap-1 ">
                                    <label> Cả ngày </label>

                                    <Switch
                                        checked={isAllDay}
                                        onChange={setIsAllDay}
                                        className="group inline-flex justify-self-end
                                        h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600
                                        transition data-checked:bg-orange-400"
                                    >
                                        <span
                                            className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6"/>
                                    </Switch>

                                    <label className="self-center">Bắt đầu</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {!isAllDay &&
                                            <TimePicker name="start-time" id="start-time"
                                                        className="justify-self-end"/>}
                                        <div className="col-start-2 col-end-3 justify-self-end">
                                            <DatePicker/>
                                        </div>
                                    </div>

                                    <label className="self-center">Kết thúc</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {!isAllDay &&
                                            <TimePicker name="end-time" id="end-time"
                                                        className="justify-self-end"/>}
                                        <div className="col-start-2 col-end-3 justify-self-end">
                                            <DatePicker/>
                                        </div>
                                    </div>

                                    <label className="self-center">Lặp lại</label>
                                    <Listbox value={selectedFrequency}
                                             onChange={setSelectedFrequency}>
                                        <ListboxButton
                                            className='relative block w-full
                                                py-1.5 pr-8 pl-1 text-left border-b border-b-orange-300
                                                focus:not-data-focus:outline-none data-focus:outline-2
                                                data-focus:-outline-offset-2 data-focus:outline-white/25'
                                        >
                                            {selectedFrequency.value}
                                            <Icon
                                                className="group pointer-events-none absolute top-2.5 right-2.5"
                                                path={mdiChevronDown} size={1}/>
                                        </ListboxButton>
                                        <ListboxOptions anchor="bottom"
                                                        className='w-(--button-width)
                                                        border border-white/5 bg-gray-100 dark:bg-gray-700
                                                         [--anchor-gap:--spacing(1)] focus:outline-none'
                                        >
                                            {frequency.map((f) => (
                                                <ListboxOption key={f.key} value={f}
                                                               className="group flex cursor-default
                                                               items-center gap-2 rounded-lg px-3
                                                               py-1.5 select-none data-focus:bg-gray-200
                                                               dark:data-focus:bg-gray-600">
                                                    {f.value}
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Listbox>
                                </div>
                            </fieldset>

                            <div className="relative w-full my-4">
                                <label
                                    htmlFor="description"
                                    className="text-lg font-bold"
                                >
                                    Mô tả
                                </label>

                                <textarea
                                    id="description"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded
                                    px-3 pt-4 pb-2  focus:outline-none focus:border-orange-300
                                    resize-none h-40!
                                    "
                                />
                            </div>

                            <div className="relative w-full my-4">
                                <fieldset className="text-lg font-bold">
                                    Nhắc nhở
                                </fieldset>
                                <div className="grid grid-cols-[8fr_1fr] gap-2">
                                    {Array.from({length: reminderCount}).map((_, idx) => {
                                        return (
                                            <>
                                                <div key={idx}>
                                                    <Listbox
                                                        value={selectedReminder[idx] ?? EMPTY_REMINDER}
                                                        onChange={(value) => {
                                                            setSelectedReminder(prev => {
                                                                const next = [...prev];
                                                                next[idx] = value;
                                                                return next;
                                                            });
                                                        }}
                                                    >
                                                        <ListboxButton
                                                            className='relative block w-full
                                                py-1.5 pr-8 pl-1 text-left border-b border-b-orange-300
                                                focus:not-data-focus:outline-none data-focus:outline-2
                                                data-focus:-outline-offset-2 data-focus:outline-white/25'
                                                        >
                                                            {selectedReminder[idx]?.value}
                                                            <Icon
                                                                className="group pointer-events-none absolute top-2.5 right-2.5"
                                                                path={mdiChevronDown} size={1}/>
                                                        </ListboxButton>
                                                        <ListboxOptions anchor="bottom"
                                                                        className='w-(--button-width)
                                                        border border-white/5 bg-gray-100 dark:bg-gray-700
                                                         [--anchor-gap:--spacing(1)] focus:outline-none'
                                                        >
                                                            {reminderTime
                                                                .filter(r => !selectedReminder.find((o) => o == r))
                                                                .map((r) => (
                                                                    <ListboxOption key={r.key}
                                                                                   value={r}
                                                                                   className="group flex cursor-default
                                                               items-center gap-2 rounded-lg px-3
                                                               py-1.5 select-none data-focus:bg-gray-200
                                                               dark:data-focus:bg-gray-600">
                                                                        {r.value}
                                                                    </ListboxOption>
                                                                ))}
                                                        </ListboxOptions>
                                                    </Listbox>
                                                </div>
                                                <Icon key={`${idx}-trash`} path={mdiDelete}
                                                      size={1}
                                                      className='justify-self-center self-center'/>
                                            </>
                                        );
                                    })}
                                    <button type="button" onClick={() => {
                                        setRemindersCount(reminderCount + 1);
                                        setSelectedReminder(prev => {
                                            const next = [...prev];
                                            while (next.length < reminderCount + 1) {
                                                next.push(null);
                                            }
                                            return next;
                                        });
                                    }}
                                            className="col-span-2 justify-self-center flex items-center
                                            gap-2 justify-center hover:bg-gray-200 py-2 w-max rounded-md px-2
                                            dark:hover:bg-gray-700 ">
                                        <Icon className="inline-block" path={mdiPlus} size={1}/>
                                        Thêm lịch nhắc nhở
                                    </button>
                                </div>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default AddNewEvent;