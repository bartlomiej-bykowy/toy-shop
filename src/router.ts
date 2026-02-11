import { Router, type Route } from "@bartlomiej-bykowy/toy-router";

const routes: Route[] = [
  { path: "/", view: () => import("./components/HomePage"), title: "Home" },
  {
    path: "/products",
    view: "app-products-page",
    preserveScrollPosition: true,
    title: "Products",
  },
  { path: "/products/:id", view: "app-product-details-page" },
  { path: "/cart", view: "app-cart-page" },
];

export const router = new Router(routes, "#app");
