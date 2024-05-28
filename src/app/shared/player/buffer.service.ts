import { Injectable } from '@angular/core';
import { BufferSegment } from './buffer-segment';

@Injectable({
  providedIn: 'root'
})
export class BufferService {
  private bufferSegments: BufferSegment[] = [];
  public addingBufferInProgress: boolean = false;
  private bufferSize: number = 0;
  constructor() { }

  public addBeginningSegment(data: ArrayBuffer, size: number) {
    this.bufferSegments.push({
      startByte: 0,
      data: data,
      endByte: size
    });

    this.bufferSize = size;
  }

  public addSegmentToEnd(data: ArrayBuffer) {
    let last = this.getBufferAtIndex(this.count - 1);
    console.log(last);
    this.bufferSegments.push({
      startByte: last.endByte + 1,
      data: data,
      // TO DO - : check that data is smaller than size, last buffer may be smaller
      endByte: (last.endByte + 1) + (this.size)
    });
  }

  public getEndBuffer() {
    return this.bufferSegments[this.bufferSegments.length - 1];
  }

  public clearBuffer() {
    this.bufferSegments = [];
  }

  public getExpectedBufferCount(fileSize: number) {
    if (fileSize % this.size == 0) {
      return fileSize / this.size;
    } else {
      return Math.floor((fileSize / this.size) + 1);
    }
  }

  /**
   * Given a byte position, return the buffer the player should be using
   */
  public getBufferIndexByPosition(bytePosition: number): number {
    for (let i = 0; i < this.bufferSegments.length; i++) {
      const buffer = this.bufferSegments[i];
      if (bytePosition > buffer.startByte && bytePosition < buffer.endByte) {
        return i;
      }
    }

    return 0;
  }

  public bufferIndexExists(index: number): boolean {
    return this.bufferSegments.at(index) != undefined;
  }

  public getBufferAtIndex(index: number): BufferSegment {
    return this.bufferSegments[index];
  }

  public getAllBufferData() {
    // Create a new ArrayBuffer with the combined length
    const combinedBuffer = new ArrayBuffer(this.getEndBuffer().endByte + 1);

    // Create views for the combined buffer and individual buffers
    const combinedView = new Uint8Array(combinedBuffer);
    let offset = 0;
    for (let buffer of this.bufferSegments) {
      const view1 = new Uint8Array(buffer.data.slice(0));
      // If no buffers are loaded, start at 0
      if (offset == 0) {
        combinedView.set(view1, 0);
      } else {
        // Add the buffer after the last one
        combinedView.set(view1, offset);
      }
      offset += view1.length;
    }

    return combinedBuffer;
  }

  /**
   * Returns the amount of buffers loaded
   */
  public get count() {
    return this.bufferSegments.length;
  }

  /**
   * Returns the size of each buffer (last buffer could differ)
   */
  public get size() {
    return this.bufferSize;
  }
}
