import { loadProducts } from "../utils/loadProducts";
import { loadTemplate } from "../utils/renderTemplate";

export class ProductDetailsPage extends HTMLElement {
  root: ShadowRoot;
  productId: number;

  constructor() {
    super();

    this.productId = 1;

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const template = await loadTemplate("product-details-page");
    this.root!.appendChild(template);

    const products = await loadProducts();
    const currentProduct = products.find((prd) => prd.id === this.productId);

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
  }
}

customElements.define("app-product-details-page", ProductDetailsPage);
