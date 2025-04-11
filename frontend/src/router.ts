import { createWebHistory, createRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("./components/Home.vue"),
    props: true
  },
  {
    path: "/gallery",
    name: "gallery",
    component: () => import("./components/Gallery.vue"),
    props: true
  },
  {
    path: "/image/:id",
    name: "image",
    component: () => import("./components/Image.vue"),
    props: ({ params }) => ({ id: Number(params.id) || 0 })
  },
  {
    path: "/upload",
    name: "upload",
    component: () => import("./components/Upload.vue"),
    props: true
  },
  {
    path: "/similar",
    name: "similar",
    component: () => import("./components/Similar.vue"),
    props: true
  },
  {
    path: "/delete",
    name: "delete",
    component: () => import("./components/Delete.vue"),
    props: true
  },
  {
    path: "/ImageQuest",
    name: "ImageQuest",
    component: () => import("./components/ImageQuest.vue"),
    props: true
  },
  {
    path: "/QuizzImage/:id",
    name: "QuizzImage",
    component: () => import("./components/QuizzImage.vue"),
    props: ({ params }) => ({ id: Number(params.id) || 0 })
  },
  {
    path: "/Result/:id",
    name: "Result",
    component: () => import("./components/Result.vue"),
    props: ({ params }) => ({ id: Number(params.id) || 0 })
  },  
  {
    path: "/QuizzDifficulty",
    name: "QuizzDifficulty",
    component: () => import("./components/QuizzDifficulty.vue"),
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;