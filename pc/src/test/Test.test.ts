import {
  describe,
  it,
  expect,
} from "vite-plus/test";

describe('suite', () => {
  it('serial test', async () => {
    expect({ a: "b" }).toStrictEqual({ a: "b" });
  });
});
