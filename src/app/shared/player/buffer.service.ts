import { Injectable } from '@angular/core';
import { BufferSegment } from './buffer-segment';

@Injectable({
  providedIn: 'root'
})
export class BufferService {
  private bufferSegments: BufferSegment[] = [];
  public addingBufferInProgress: boolean = false;
  constructor() { }

  public addBeginningSegment(data: ArrayBuffer, size: number) {
    this.bufferSegments.push({
      startByte: 0,
      data: data,
      endByte: size
    });
  }

  public addSegmentToEnd(data: ArrayBuffer) {
    let last = this.getBufferAtIndex(this.count - 1);
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

  public getBlobForBuffers(): string {
    let buffers = [];
    for (let buffer of this.bufferSegments) {
      buffers.push(buffer.data);
    }

    console.log(buffers);

    let blob = new Blob([...buffers]);
    return URL.createObjectURL(blob);
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
    return this.bufferSegments[0].data.byteLength;
  }
}
