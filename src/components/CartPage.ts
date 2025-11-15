import { loadProducts, type Product } from "../utils/loadProducts";
import { loadTemplate } from "../utils/renderTemplate";

export class CartPage extends HTMLElement {
  root: ShadowRoot;
  cartItems: Product[];

  constructor() {
    super();
    this.cartItems = [];

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const termplate = await loadTemplate("cart-page");
    this.root.replaceChildren(termplate);

    // TODO: load items from store
    this.cartItems = await this.loadCart();

    const emptyCart = this.root.querySelector("#cart-empty")!;
    const listEl = this.root.querySelector("#cart-items")!;
    const cartSummary =
      this.root.querySelector<HTMLDivElement>("#cart-summary")!;
    const totalEl = this.root.querySelector("#cart-total")!;
    const itemTemplate = this.root.querySelector<HTMLTemplateElement>(
      "#cart-item-template"
    )!;

    if (this.cartItems.length === 0) {
      emptyCart.removeAttribute("hidden");
      cartSummary.style.display = "none";
      return;
    }

    emptyCart.setAttribute("hidden", "");
    cartSummary.style.display = "flex";

    const items = this.cartItems.map((item) => {
      const fragment = itemTemplate.content.cloneNode(true) as DocumentFragment;

      fragment.querySelector<HTMLImageElement>(".item-img")!.src = item.img;
      fragment.querySelector(".item-name")!.textContent = item.name;
      fragment.querySelector(".item-price")!.textContent = `$${item.price}`;

      fragment.querySelector(".remove-btn")!.addEventListener("click", () => {
        this.removeFromCart(item.id);
      });

      return fragment;
    });

    listEl.replaceChildren(...items);

    const total = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    totalEl.textContent = `$${total}`;

    this.root.querySelector("#buy-btn")!.addEventListener("click", () => {
      alert("Thank you for buing our products!");
      this.cartItems = [];
      // TODO: navigate to the home page
    });
  }

  async loadCart(): Promise<Product[]> {
    return await loadProducts();
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.render();
  }
}

customElements.define("app-cart-page", CartPage);
