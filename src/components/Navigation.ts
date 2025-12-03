import { productsStore } from "../store";
import { loadTemplate } from "../utils/renderTemplate";

type NavLink = { text: string; icon: string };

export class Navigation extends HTMLElement {
  links: NavLink[];
  root: ShadowRoot;
  unsubscribe: null | (() => void);

  constructor() {
    super();

    this.links = [
      {
        text: "Home",
        icon: "🏠",
      },
      {
        text: "Products",
        icon: "💸",
      },
      {
        text: "Cart",
        icon: "🛒",
      },
    ];

    this.unsubscribe = null;

    this.root = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.render();

    const cartCountEl = this.root.querySelector(".cart-count");

    this.unsubscribe = productsStore.$subscribeKey("cart", (_, newVal) => {
      cartCountEl!.textContent = String(productsStore.productsInCart);
      if (newVal.length > 0) {
        cartCountEl?.classList.remove("cart-count-hidden");
      } else {
        cartCountEl?.classList.add("cart-count-hidden");
      }
    });
  }

  disconnectedCallback() {
    this.unsubscribe!();
  }

  async render() {
    const template = await loadTemplate("navigation");
    this.root.appendChild(template);

    const ul = this.root.getElementById("nav-links") as HTMLUListElement;

    if (!ul) {
      console.log("no ul");
      return;
    }

    ul.innerHTML = this.links
      .map((link) => this.renderNavElement(link))
      .join("");
  }

  renderNavElement(el: NavLink): string {
    const { text, icon } = el;
    const lower = text.toLowerCase();

    if (lower === "cart") {
      return `
        <li class="nav-item nav-item-cart">
          <a href="/cart">${icon} ${text}</a>
          <span class="cart-count cart-count-hidden"></span>
        </li>
      `;
    }

    return `
      <li class="nav-item nav-item-${lower}">
        <a href="/${lower === "home" ? "" : lower}">
          ${icon} ${text}
        </a>
      </li>
  `;
  }
}

customElements.define("app-nav", Navigation);
