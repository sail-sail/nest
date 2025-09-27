export class S3Error extends Error {
  override name = "S3Error";
  response: string;
  constructor(message: string, response: string) {
    super(message);
    this.response = response;
  }
}
