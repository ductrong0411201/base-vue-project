import axios from "axios";
import store from "@/store";
import { SET_TOKEN } from "@/store/mutation-types";
import { merge } from "lodash";
class BaseApi {
  get source() {
    return this._source;
  }
  set source(value) {
    this._source = value;
  }
  constructor() {
    this._source = axios.CancelToken.source();
  }
  submit(method, url, data, config = {}) {
    return new Promise((resolve, reject) => {
      this._submit(method, url, data, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }
  _submit(method, url, data, config = {}) {
    // transformRequest for get method
    if (method === "get") {
      data = this._transformGetData(config, data);
    }
    config = merge(
      {
        method: method,
        url: url,
        //   cancelToken: this._source.token,
        params: method === "get" ? data : {},
        data: method !== "get" ? data : {},
        headers: {
          Accept: "application/json",
          "Content-Type":
            data instanceof window.FormData
              ? "multipart/form-data"
              : "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      },
      config
    );

    return axios(config);
  }
  //   authSubmit(method, url, data, config = {}) {
  //     let currentTime = new Date();
  //     if (!this._oldTime) {
  //       this._oldTime = new Date();
  //     }
  //     let diff = (currentTime.getTime() - this._oldTime.getTime()) / 1000;
  //     this._oldTime = currentTime;
  //     if (diff > 30 * 60 * 60) {
  //       this.logout();
  //     }
  //     return new Promise((resolve, reject) => {
  //       this._authSubmit(method, url, data, config)
  //         .then((response) => resolve(response))
  //         .catch((error) => reject(error));
  //     });
  //   }
  //   _authSubmit (method, url, data, config = {}) {
  //     return new Promise((resolve, reject) => {
  //       this._submitWithToken(method, url, data, config)
  //         .then(response => resolve(response))
  //         .catch(error => {
  //           if (this._shouldRefreshToken(error)) {
  //             this.refreshToken()
  //               .then(response => {
  //                 store.commit(SET_TOKEN, response.data.token)
  //                 this._submitWithToken(method, url, data, config)
  //                   .then(response => resolve(response))
  //                   .catch(error => reject(error))
  //               })
  //               .catch(error => {
  //                 reject(error)
  //                 this._handleTokenExpired()
  //               })
  //           } else {
  //             reject(error)
  //           }
  //         })
  //     })
  //   }
  //   _submitWithToken (method, url, data, config = {}) {
  //     const token = store.state.auth.token
  //     if (token) {
  //       config = merge({
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       }, config)
  //     }

  //     return this._submit(method, url, data, config)
  //   }
  _transformGetData(config, data) {
    if (this._needToTransform(config, data)) {
      data = JSON.parse(config.transformRequest[0](data));
      config.transformRequest = []; // Must call after call transformRequest
      return data;
    } else {
      return data;
    }
  }

  _needToTransform(config) {
    return (
      config.transformRequest &&
      config.transformRequest.length > 0 &&
      typeof config.transformRequest[0] === "function"
    );
  }
}

export default BaseApi;
