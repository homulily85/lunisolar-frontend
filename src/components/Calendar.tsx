const Calendar = () => {
    const range = (x: number, y: number) => {
        const arr = [];
        for (let i = x; i <= y; i++) {
            arr.push(i);
        }
        return arr;
    };

    return <div className="bg-gray-200 grid grid-cols-7 grid-rows-[1fr_repeat(5,3fr)] gap-2 p-4">
        {['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'].map((d) => {
            return <div key={d} className={'bg-white justify-items-center rounded-lg py-2 px-4'}>
                <p className={'font-bold text-lg text-orange-700'}>{d}</p>
            </div>;
        })}

        {range(1, 35).map((d) => {
            return <div key={d} className={'bg-white justify-items-center rounded-lg py-2 px-4'}>
                <p className={'text-lg'}>{d}</p>
                <p className={'text-sm'}>{d}</p>
            </div>;
        })}
    </div>;
};

export default Calendar;