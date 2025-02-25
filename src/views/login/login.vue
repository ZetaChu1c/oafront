<template>
  <body>
    <div class="dowebok">
      <div class="container-login100">
        <div class="wrap-login100">
          <div class="login100-pic js-tilt" data-tilt>
            <img :src="login_image" alt="IMG" />
          </div>

          <div class="login100-form validate-form">
            <span class="login100-form-title"> 欢迎登陆ctOS </span>

            <div class="wrap-input100 validate-input">
              <input
                class="input100"
                type="text"
                name="email"
                placeholder="邮箱"
                v-model="form.email"
              />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i
                  class="iconfont icon-a-shapeemailpressedtrue"
                  aria-hidden="true"
                ></i>
              </span>
            </div>

            <div class="wrap-input100 validate-input">
              <input
                class="input100"
                type="password"
                name="password"
                placeholder="密码"
                v-model="form.password"
              />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i
                  class="iconfont icon-a-shapepasswordpressedtrue"
                  aria-hidden="true"
                ></i>
              </span>
            </div>

            <div class="container-login100-form-btn">
              <button class="login100-form-btn" @click="onSubmit">登陆</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup name="login">
import login_image from "@/assets/images/login.png";
import { onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import authHttp from "@/api/authHttp";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();
const router = useRouter();

let form = reactive({
  email: "",
  password: "",
});

function onKeyUp(e) {
  if (e.key == "Enter") onSubmit();
}

const onSubmit = async () => {
  // 此处使用6到20位，以匹配后端检测规则
  let pwdRgx = /^[a-zA-Z0-9_-]{6,20}/;
  let emailRgx = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

  if (!emailRgx.test(form.email)) {
    ElMessage.info("邮箱格式不正确");
    return;
  }

  if (!pwdRgx.test(form.password)) {
    ElMessage.info("密码格式不正确");
    return;
  }

  try {
    let data = await authHttp.login(form.email, form.password);
    let token = data.token;
    let user = data.user;
    authStore.setUserToken(user, token);
    router.push({ name: "home" });
  } catch (detail) {
    ElMessage.error(detail);
  }
};

// 实现回车登录
onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
});
</script>

<style scoped src="@/assets/css/login.css"></style>
<style scoped src="@/assets/iconfont/iconfont.css"></style>
