export default class ReqErr {
  constructor(
    public message: string,
    public statusCode?: number
  ) {}
}
