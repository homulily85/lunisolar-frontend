import React from 'react';
import type {DayInfo} from '../../type.ts';

const DayCell = React.memo(function DayCell({
                                                info,
                                                onSelect
                                            }: {
    info: DayInfo;
    onSelect: (ts: number) => void;
}) {
    const {date, ts, lunarText, isToday, isSelected, isCurrentMonth} = info;

    const bgClass = (isToday && isCurrentMonth) ? 'bg-orange-400 dark:bg-orange-700'
        : isSelected ? 'bg-orange-200 dark:bg-yellow-700' : 'bg-white dark:bg-gray-700';
    const textColor = isCurrentMonth ? 'text-black dark:text-white'
        : 'text-gray-500 dark:text-gray-400';

    return (
        <div
            data-date={ts}
            onClick={() => onSelect(ts)}
            className={`${bgClass} justify-items-center rounded-lg py-2 px-4 h-full 
                        ${(isSelected || isToday ? '' : ' hover:bg-gray-100 dark:hover:bg-gray-600')}`}
        >
            <p className={`text-lg ${textColor}`}>{date.getDate()}</p>
            <p className={`text-sm ${textColor}`}>{lunarText}</p>
        </div>
    );
});

export default DayCell;