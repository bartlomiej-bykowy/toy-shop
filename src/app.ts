import { Navigation } from "./components";
import { HomePage } from "./components";
import { ProductsPage } from "./components";
import { ProductDetailsPage } from "./components";
import { CartPage } from "./components";

import { Router, type Route } from "@bartlomiej-bykowy/toy-router";
import { loadProducts } from "./utils/loadProducts";

await loadProducts();

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
