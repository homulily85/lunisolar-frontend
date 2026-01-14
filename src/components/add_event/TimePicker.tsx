import { useMemo } from "react";
import timesToPick from "../../utils/timesToPick.ts";

const TimePicker = ({
    name,
    id,
    className = "",
}: {
    name: string;
    id: string;
    className: string;
}) => {
    const times = useMemo(() => timesToPick(), []);

    return (
        <div className={className}>
            <input
                list='times'
                name={name}
                id={id}
                defaultValue={times[0]}
                className='px-1 w-full h-full focus:outline-none border-b border-b-orange-300 focus:border-b-2'
            />
            <datalist id='times'>
                {times.map((t) => {
                    return <option value={t} key={t} />;
                })}
            </datalist>
        </div>
    );
};

export default TimePicker;
