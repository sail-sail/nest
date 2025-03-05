export {
  AWSSignerV4,
  toAmz,
  toDateStamp,
} from "./aws_sign_v4/mod.ts";
export type {
  Credentials,
  Signer,
} from "./aws_sign_v4/mod.ts";
export { default as parseXML } from "./xml-parser.ts";
export { decode as decodeXMLEntities } from "./xml-entities.js";
export { pooledMap } from "./pool.ts";
