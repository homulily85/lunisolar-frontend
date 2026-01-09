import React from 'react';
import type {DayInfo} from '../../type.ts';

const DayCell = React.memo(function DayCell({
                                                info,
                                                onSelect,
                                            }: {
    info: DayInfo;
    onSelect: (ts: number) => void;
}) {
    const {date, ts, lunarText, isToday, isSelected, isCurrentMonth} = info;

    const bgClass = isToday ? 'bg-orange-400' : isSelected ? 'bg-yellow-200' : 'bg-white';
    const textColor = isCurrentMonth ? 'text-black' : 'text-gray-500';

    return (
        <div
            data-date={ts}
            onClick={() => onSelect(ts)}
            className={`${bgClass} justify-items-center rounded-lg py-2 px-4 h-full`}
        >
            <p className={`text-lg ${textColor}`}>{date.getDate()}</p>
            <p className={`text-sm ${textColor}`}>{lunarText}</p>
        </div>
    );
});

export default DayCell;