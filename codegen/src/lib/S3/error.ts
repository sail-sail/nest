export class S3Error extends Error {
  override name = "S3Error";
  constructor(message: string, public response: string) {
    super(message);
  }
}
