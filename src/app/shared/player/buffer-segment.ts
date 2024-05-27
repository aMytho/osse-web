/**
 * Save or preloaded segment of audio
 */
export interface BufferSegment {
    startByte: number;
    endByte: number;
    data: ArrayBuffer;
}