import { type EventFromServer } from "../../type.ts";

import { formatDateTime } from "../../utils/misc.ts";

const SidebarItem = ({ e }: { e: EventFromServer }) => {
    const label = `${e.title}\n${formatDateTime(new Date(e.startDateTime))} - ${formatDateTime(new Date(e.endDateTime))}`;
    return (
        <div
            aria-label={e.title}
            title={label}
            id={e.id}
            className='my-1 grid grid-cols-[3fr_1fr]'>
            <p className='truncate'>{e.title}</p>
        </div>
    );
};

export default SidebarItem;
