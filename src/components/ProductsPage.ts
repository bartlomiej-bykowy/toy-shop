import { productsStore, type Product } from "../store";
import { loadTemplate } from "../utils/renderTemplate";

export class ProductsPage extends HTMLElement {
  root: ShadowRoot;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const template = await loadTemplate("products-page");
    this.root!.appendChild(template);
    await Promise.resolve();

    const productsGrid = this.root!.querySelector("#products-grid")!;
    productsGrid.append("Loading...");

    const { products } = productsStore.$state;

    const itemTemplate = this.root!.querySelector<HTMLTemplateElement>(
      "#product-item-template"
    )!;

    const cells: Node[] = products.map((product: Product) => {
      const clone = itemTemplate.content.cloneNode(true) as DocumentFragment;
      clone.querySelector("a")!.href = `/products/${product.id}`;
      clone.querySelector("img")!.src = product.img;
      clone.querySelector("img")!.alt = "";
      clone.querySelector(".product-name")!.textContent = product.name;
      clone.querySelector(
        ".product-price"
      )!.textContent = `Price: $${product.price}`;

      clone
        .querySelector<HTMLButtonElement>(".add-btn")!
        .addEventListener("click", (e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          productsStore.addToCart([product]);
        });

      return clone;
    });

    this.root!.querySelector("#products-grid")!.replaceChildren(...cells);
  }
}

customElements.define("app-products-page", ProductsPage);
