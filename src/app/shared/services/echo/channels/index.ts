import { ScanEventMap } from "./scan";

// Add to this as new events are created.
export type EchoEventMap = ScanEventMap;

/**
 * Every possible channel to subscribe to.
 */
export type EchoChannel = keyof EchoEventMap;

/**
 * Every possilbe result for an echo event.
 */
export type EchoResult<T extends EchoChannel> = EchoEventMap[T];

