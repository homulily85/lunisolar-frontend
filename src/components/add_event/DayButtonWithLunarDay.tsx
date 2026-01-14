import { DayButton, type DayButtonProps } from "react-day-picker";
import { LunarCalendar } from "@dqcai/vn-lunar";

const DayButtonWithLunarDay = (props: DayButtonProps) => {
    const { day, modifiers, ...buttonProps } = props;
    const lunarDay = LunarCalendar.fromSolar(
        day.date.getDate(),
        day.date.getMonth() + 1,
        day.date.getFullYear(),
    );
    return (
        <div className='flex flex-col'>
            <DayButton {...buttonProps} day={day} modifiers={modifiers} />
            <span className='text-sm'>
                {lunarDay.lunarDate.day === 1 || day.date.getDate() === 1
                    ? `${lunarDay.lunarDate.day}/${lunarDay.lunarDate.month}`
                    : lunarDay.lunarDate.day}
            </span>
        </div>
    );
};

export default DayButtonWithLunarDay;
