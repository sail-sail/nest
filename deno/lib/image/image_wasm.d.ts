/* tslint:disable */
/* eslint-disable */
/**
 * @param {Uint8Array} content
 * @param {string} f
 * @param {number} w
 * @param {number} h
 * @param {number} q
 * @returns {Uint8Array}
 */
export function resize(content: Uint8Array, f: string, w: number, h: number, q: number): Uint8Array;
/**
 * Sample position for subsampled chroma
 */
export enum ChromaSamplePosition {
  /**
   * The source video transfer function must be signaled
   * outside the AV1 bitstream.
   */
  Unknown = 0,
  /**
   * Horizontally co-located with (0, 0) luma sample, vertically positioned
   * in the middle between two luma samples.
   */
  Vertical = 1,
  /**
   * Co-located with (0, 0) luma sample.
   */
  Colocated = 2,
}
/**
 * Chroma subsampling format
 */
export enum ChromaSampling {
  /**
   * Both vertically and horizontally subsampled.
   */
  Cs420 = 0,
  /**
   * Horizontally subsampled.
   */
  Cs422 = 1,
  /**
   * Not subsampled.
   */
  Cs444 = 2,
  /**
   * Monochrome.
   */
  Cs400 = 3,
}
/**
 * Allowed pixel value range
 *
 * C.f. `VideoFullRangeFlag` variable specified in ISO/IEC 23091-4/ITU-T H.273
 */
export enum PixelRange {
  /**
   * Studio swing representation
   */
  Limited = 0,
  /**
   * Full swing representation
   */
  Full = 1,
}
export enum Tune {
  Psnr = 0,
  Psychovisual = 1,
}
