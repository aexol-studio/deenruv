export class InvalidBody extends Error {}

export class InvalidResponseStatus extends Error {
  constructor(
    msg: string,
    public res: Response,
  ) {
    super(msg);
  }
}
