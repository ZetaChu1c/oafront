const routes = [
  {
    path: "/login",
    name: "login",
    // 此处如果直接引用login组件，会出现Vue router warn
    component: () => import("@/views/login/login.vue"),
  },
];

export default routes;
