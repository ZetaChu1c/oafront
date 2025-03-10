import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import frame_routes from "@/router/frame";
import login_routes from "@/router/login";

const router = createRouter({
  // 为了避免与后台hash产生冲突，这里使用hash方法
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: frame_routes.concat(login_routes),
});

router.beforeEach((to, from) => {
  // 判断是否登录
  const authStore = useAuthStore();
  if (!authStore.is_logined && to.name != "login") {
    return { name: "login" };
  }
});

export default router;
