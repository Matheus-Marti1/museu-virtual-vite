import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Timeline from "../views/Timeline.vue";
import Membros from "../views/Membros.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/timeline",
    name: "Timeline",
    component: Timeline,
  },
  {
    path: "/membros",
    name: "Membros",
    component: Membros,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
