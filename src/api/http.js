import axios from "axios";
import { useAuthStore } from "@/stores/auth";

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 6000,
    });

    this.instance.interceptors.request.use((config) => {
      const authStore = useAuthStore();
      const token = authStore.token;

      if (token) {
        config.headers.Authorization = "JWT " + token;
      }

      return config;
    });
  }

  post(path, data) {
    // return this.instance.post(path, data);
    return new Promise(async (resolve, reject) => {
      // await：网络请求发送之后，线程会进行挂起等待
      // 等待网络数据到达之后,线程会回到当前位置继续向下执行
      // 在函数中使用了await，则该函数必须定义为async
      // axios底层也使用了Promise对象，在响应的状态码不为200时，就会调用reject
      // 外层函数会抛出异常
      try {
        let result = await this.instance.post(path, data);
        resolve(result.data);
      } catch (err) {
        // 如果进入到catch，则状态码必定不为200
        let detail = err.response.data.detail;
        reject(detail);
      }
    });
  }

  get(path, params) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this.instance.get(path, { params });
        resolve(result.data);
        console.log(result.data);
        
      } catch (err) {
        let detail = err.response.data.detail;
        reject(detail);
      }
    });
  }

  put(path, data) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this.instance.put(path, data);
        resolve(result.data);
      } catch (err) {
        let detail = err.response.data.detail;
        reject(detail);
      }
    });
  }

  delete(path) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this.instance.delete(path);
        // 服务端的delete方法，只返回一个状态码，并没有数据，因此直接返回result即可
        resolve(result);
      } catch (err) {
        try {
          let detail = err.response.data.detail;
          reject(detail);
        } catch {
          reject("服务器出现错误");
        }
      }
    });
  }

  downloadFile(path, params) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this.instance.get(path, {
          params,
          responseType: "blob",
        });
        resolve(result);
      } catch (err) {
        let detail = err.response.data.detail;
        reject(detail);
      }
    });
  }
}
export default new Http();
