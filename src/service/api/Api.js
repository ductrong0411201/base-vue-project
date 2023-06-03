import BaseApi from "./BaseApi";

class Api extends BaseApi {
  submit(method, url, data, config = {}) {
    const submit = super.submit(method, url, data, config);
    return submit;
  }
  authSubmit(method, url, data, config = {}) {
    const submit = super.authSubmit(method, url, data, config);
    return submit;
  }
}
export default new Api();
