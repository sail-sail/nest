import {
  describe,
  it,
  expect,
} from "vitest";

describe('suite', () => {
  it('serial test', async () => {
    expect({ a: "b" }).toStrictEqual({ a: "b" });
  });
});
