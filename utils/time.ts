export function momentToString(timeInMs: number){
    const secs = timeInMs / 1000;
    if(secs < 60){
        return `${secs.toFixed(0)} seconds`;
    }
    const mins = secs / 60;
    if(mins < 60){
        return `${mins.toFixed(0)} minutes`;
    }
    const hrs = mins / 60;
    if(hrs < 24){
        return `${hrs.toFixed(0)} hours`;
    }
    const days = hrs /24;
    if(days < 30){
        return `${days.toFixed(0)} days`;
    }
    const months = days /30;
    if(months < 12){
        return `${months.toFixed(0)} months`;
    }
    return `${(months / 12).toFixed(0)} years`;
}