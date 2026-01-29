import { type EventFromServer } from "../../type.ts";

import { formatDateTime } from "../../utils/misc.ts";
import { useEffect, useRef, useState } from "react";
import EventInfoPopup from "../popup/EventInfoPopup.tsx";

const SidebarItem = ({ e }: { e: EventFromServer }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [showInfo, setShowInfo] = useState(false);
    const label = `${e.title}\n${formatDateTime(new Date(e.startDateTime))} - ${formatDateTime(new Date(e.endDateTime))}`;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!popupRef.current?.contains(e.target as Node)) {
                setShowInfo(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='w-full relative'>
            <button
                onClick={() => setShowInfo(true)}
                aria-label={e.title}
                title={label}
                id={e.id}
                className='my-1 hover:cursor-pointer  dark:hover:bg-gray-800 hover:bg-gray-100 w-full'>
                <p className='truncate text-left'>{e.title}</p>
            </button>
            {showInfo && <EventInfoPopup event={e} popupRef={popupRef} />}
        </div>
    );
};

export default SidebarItem;
