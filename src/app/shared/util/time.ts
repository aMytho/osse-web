/**
 * Gets a duration in min:second format
 * @param trackSeconds 
 * @returns 
 */
export function getDuration(trackSeconds: number) {
    let date = new Date(0);
    date.setSeconds(trackSeconds + 1);
    
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${getNicelyFormattedTime(minutes)}:${getNicelyFormattedTime(seconds)}`;
}

function getNicelyFormattedTime(time: number): string {
    if (time == 0) {
        return '00';
    }

    // Handle 1,2,3,
    if (time < 10) {
        return '0' + time;
    }

    // Ok format, leave as is
    return time.toString();
}