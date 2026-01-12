import {useEffect, useRef, useState} from 'react';
import {DayPicker, getDefaultClassNames} from 'react-day-picker';
import {vi} from 'react-day-picker/locale';
import {useAppSelector} from '../../hook.ts';
import DayButtonWithLunarDay from './DayButtonWithLunarDay.tsx';

const DatePicker = () => {
    const selectedTs = useAppSelector((s) => s.date.currentSelectedSolarDate);
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(selectedTs));
    const ref = useRef<HTMLDivElement>(null);
    const defaultClassNames = getDefaultClassNames();

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return <>
        <div ref={ref} className="relative">
            <input
                type="text"
                readOnly
                value={selectedDate?.toLocaleDateString('vi-VN')}
                onClick={() => setOpen(o => !o)}
                className="border rounded py-1 w-full cursor-pointer border-b-orange-300 border-b border-transparent
                focus:outline-none focus:border-b-2"
            />
            {open && (
                <div className="absolute z-50 mt-2 bg-white shadow-lg rounded ">
                    <DayPicker
                        components={{DayButton: DayButtonWithLunarDay}}
                        defaultMonth={selectedDate}
                        captionLayout="dropdown"
                        locale={vi}
                        classNames={{
                            today: 'text-orange-800 dark:text-orange-500',
                            selected: 'bg-amber-500 border-amber-500 rounded-md text-white dark:text-white',
                            root: `${defaultClassNames.root} shadow-lg p-5`,
                            chevron: `${defaultClassNames.chevron} fill-amber-500`,
                        }}
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            setSelectedDate(date);
                            setOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    </>;
};

export default DatePicker;