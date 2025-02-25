import http from "./http";

const login = (email, password) => {
  const path = "/auth/login";
  // {}不是()
  return http.post(path, { email, password });
};

const resetPwd = (oldpwd, pwd1, pwd2) => {
  const path = "/auth/resetpwd";
  return http.post(path, { oldpwd, pwd1, pwd2 });
};

export default {
  login,
  resetPwd,
};
