const timesToPick = () => {
    const res: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (const minute of [0, 15, 30, 45]) {
            res.push(
                `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
            );
        }
    }
    return res;
};

export default timesToPick;
