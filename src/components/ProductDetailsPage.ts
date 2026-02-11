import { router } from "../router";
import { productsStore } from "../store";
import { loadTemplate } from "../utils/renderTemplate";

export class ProductDetailsPage extends HTMLElement {
  root: ShadowRoot;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const template = await loadTemplate("product-details-page");
    this.root!.appendChild(template);

    const { products } = productsStore.$state;
    const productId = Number(router.params().params.id);
    const currentProduct = products.find((prd) => prd.id === productId);

    if (!currentProduct) return;

    this.root!.querySelector("#product-name")!.textContent =
      currentProduct.name;
    this.root!.querySelector<HTMLImageElement>("#product-image")!.src =
      currentProduct.img;
    this.root!.querySelector("#product-desc")!.textContent =
      currentProduct.desc;
    this.root!.querySelector(
      "#product-price"
    )!.textContent = `Price: $${currentProduct.price}`;
    this.root!.querySelector("#add-to-cart")!.addEventListener("click", () =>
      productsStore.addToCart([currentProduct])
    );
  }
}

customElements.define("app-product-details-page", ProductDetailsPage);
