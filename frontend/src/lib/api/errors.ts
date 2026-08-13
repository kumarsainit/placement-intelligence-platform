export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
