/**
 * Attempts to figure out the amount of bytes in the first 10 seconds of a file.
 * If the file is very small, returns the entire file
 * @param fileSize (bytes)
 * @param duration (seconds)
 */
export function guessByteSizeForFirstBuffer(fileSize: number, duration: number): number {
    // If the file is less than 10 seconds, return the whole file
    if (duration <= 10) {
        return fileSize;
    }

    let bytesPerSecond = fileSize / duration;
    return Math.floor(bytesPerSecond * 10);
}

/**
 * Given a time and buffer size, guess the byte position
 */
export function estimatedBytesForBuffer(seconds: number, bufferSize: number): number {
    seconds = Math.round(seconds);
    let bytesPerSecond = bufferSize / 10;

    return Math.floor(bytesPerSecond * seconds);
}

// export function estimatedBytesForFile(seconds: number, fileSize: number, duration:): number {
//     seconds = Math.round(seconds);
//     let bytesPerSecond = fileSize 
// }

// CHANGE THE 10 to 30