export default class HTTPSuccessResponse {
  public code = 200;
  public message = 'Success';
  public object = {};
  constructor(object: any) {
    this.object = object;
  }
}
