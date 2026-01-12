import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {useAppDispatch, useAppSelector} from '../../hook.ts';
import {setShowDialog} from '../../reducers/uiReducer.ts';
import {useState} from 'react';
import TimePicker from './TimePicker.tsx';
import DatePicker from './DatePicker.tsx';
import {mdiPlus} from '@mdi/js';
import Icon from '@mdi/react';

const AddNewEvent = () => {
    const [isAllDay, setIsAllDay] = useState(false);
    const showDialog = useAppSelector(state => state.ui.showDialog);
    const dispatch = useAppDispatch();

    const onClose = () => {
        dispatch(setShowDialog(false));
    };

    const switchIsAllDay = () => {
        setIsAllDay(!isAllDay);
    };

    return (
        <>
            <Dialog open={showDialog} onClose={onClose} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/50"/>
                <div
                    className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel
                        className="space-y-4 bg-white px-8 py-6 rounded-xl w-xl">
                        <div className="grid grid-cols-[auto_1fr_auto]">
                            <button className="py-2 px-4 bg-gray-200 rounded-lg hover:bg-gray-300
                            font-bold"
                                    onClick={onClose}>
                                Hủy
                            </button>
                            <DialogTitle
                                className="font-bold text-2xl text-center self-center">
                                Thêm sự kiện
                            </DialogTitle>
                            <button
                                className="py-2 px-4 bg-orange-300 rounded-lg hover:bg-orange-400
                                font-bold"
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
                                    px-3 pt-4 pb-2 text-lg focus:outline-none focus:border-orange-300"
                                />

                                <label
                                    htmlFor="title"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all
                                    duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                                    peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:text-sm
                                    peer-focus:translate-y-0"
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
                                    px-3 pt-4 pb-2 text-lg focus:outline-none focus:border-orange-300"
                                />

                                <label
                                    htmlFor="location"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all
                                    duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                                    peer-placeholder-shown:text-lg peer-focus:-top-2 peer-focus:text-sm
                                    peer-focus:translate-y-0"
                                >
                                    Địa điểm
                                </label>
                            </div>

                            <fieldset className="my-4">
                                <legend className="text-lg font-bold">Thời gian</legend>
                                <div className="grid grid-cols-2 my-2 text-lg gap-1 "><label
                                    htmlFor="isAllDay"> Cả ngày </label>

                                    <input type="checkbox" id="isAllDay" onChange={switchIsAllDay}
                                           className="justify-self-end w-5 h-5 accent-orange-400"/>

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

                                    <label htmlFor="repeat" className="self-center">Lặp lại</label>
                                    <select name="repeat" id="repeat"
                                            className="justify-self-end w-full py-1
                                             focus:outline-none border-b border-b-orange-300
                                             focus:border-b-2">
                                        <option value='no' key='no'>Không</option>
                                        <option value='everyday' key='everyday'>Hàng ngày
                                        </option>
                                        <option value='everyweek' key='everyweek'>Hàng tuần
                                        </option>
                                        <option value='every-two-weeks'
                                                key='every-two-weeks'>Mỗi
                                            hai tuần
                                        </option>
                                        <option value='every-month' key='every-month'>Hàng tháng
                                        </option>
                                        <option value='every-year' key='every-year'>Hàng năm
                                        </option>
                                    </select>
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
                                <div className="grid grid-cols-2">
                                    <button type="button"
                                            className="col-span-2 justify-self-center flex items-center
                                            gap-2 justify-center hover:bg-gray-200 py-2 w-max rounded-md px-2">
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