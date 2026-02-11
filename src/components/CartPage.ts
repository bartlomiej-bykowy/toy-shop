import { router } from "../router";
import { productsStore } from "../store";
import { loadTemplate } from "../utils/renderTemplate";

export class CartPage extends HTMLElement {
  root: ShadowRoot;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const termplate = await loadTemplate("cart-page");
    this.root.replaceChildren(termplate);

    const emptyCart = this.root.querySelector("#cart-empty")!;
    const listEl = this.root.querySelector("#cart-items")!;
    const cartSummary =
      this.root.querySelector<HTMLDivElement>("#cart-summary")!;
    const totalEl = this.root.querySelector("#cart-total")!;
    const itemTemplate = this.root.querySelector<HTMLTemplateElement>(
      "#cart-item-template"
    )!;

    const productsInCart = productsStore.$state.cart;

    if (productsInCart.length === 0) {
      emptyCart.removeAttribute("hidden");
      cartSummary.style.display = "none";
      return;
    }

    emptyCart.setAttribute("hidden", "");
    cartSummary.style.display = "flex";

    const items = productsInCart.map((item) => {
      const fragment = itemTemplate.content.cloneNode(true) as DocumentFragment;

      fragment.querySelector<HTMLImageElement>(".item-img")!.src = item.img;
      fragment.querySelector(".item-name")!.textContent = item.name;
      fragment.querySelector(".item-price")!.textContent = `$${item.price}`;

      fragment
        .querySelector(".remove-btn")!
        .addEventListener("click", () => this.removeFromCart(item.cartId));

      return fragment;
    });

    listEl.replaceChildren(...items);

    const total = productsStore.$state.cart.reduce(
      (sum, item) => sum + item.price,
      0
    );
    totalEl.textContent = `$${total}`;

    this.root.querySelector("#buy-btn")!.addEventListener("click", () => {
      alert("Thank you for buiyng our products!");
      productsStore.clearCart();
      router.navigate("/");
    });
  }

  removeFromCart(itemId: string): void {
    productsStore.removeFromCart(itemId);
    this.render();
  }
}

customElements.define("app-cart-page", CartPage);
