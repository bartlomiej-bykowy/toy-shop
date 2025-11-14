import { loadTemplate } from "../utils/renderTemplate";

type Product = {
  id: number;
  name: string;
  desc: string;
  img: string;
  price: number;
};

export class ProductsPage extends HTMLElement {
  root: ShadowRoot;
  products: Product[];

  constructor() {
    super();

    this.products = [];

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async loadProducts(): Promise<Product[]> {
    const data = await fetch("/src/data/products.json");
    const products: Product[] = await data.json();
    return products;
  }

  async render() {
    const template = await loadTemplate("products-page");
    this.root!.appendChild(template);
    await Promise.resolve();

    const productsGrid = this.root!.querySelector("#products-grid")!;
    productsGrid.append("Loading...");

    this.products = await this.loadProducts();

    const itemTemplate = this.root!.querySelector<HTMLTemplateElement>(
      "#product-item-template"
    )!;

    console.log(itemTemplate);

    const cells: Node[] = this.products.map((product) => {
      const clone = itemTemplate.content.cloneNode(true) as DocumentFragment;
      clone.querySelector("a")!.href = `/products/${product.id}`;
      clone.querySelector("img")!.src = product.img;
      clone.querySelector("img")!.alt = "";
      clone.querySelector(".product-name")!.textContent = product.name;
      clone.querySelector(
        ".product-price"
      )!.textContent = `Price: ${product.price}$`;

      clone
        .querySelector<HTMLButtonElement>(".add-btn")!
        .addEventListener("click", (e: MouseEvent) => {
          e.stopPropagation();
          console.log(`${product.name} added to cart.`);
        });

      return clone;
    });

    this.root!.querySelector("#products-grid")!.replaceChildren(...cells);
  }
}

customElements.define("app-products-page", ProductsPage);
