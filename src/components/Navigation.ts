import { router } from "../router";
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

    this.markNavLinkActive(router.url().pathname);

    const cartCountEl = this.root.querySelector(".cart-count");

    this.unsubscribe = productsStore.$subscribeKey("cart", (_, newVal) => {
      cartCountEl!.textContent = String(productsStore.productsInCart);
      if (newVal.length > 0) {
        cartCountEl?.classList.remove("cart-count-hidden");
      } else {
        cartCountEl?.classList.add("cart-count-hidden");
      }
    });

    router.onRouteChange((ctx) => {
      const { pathname } = ctx;
      this.markNavLinkActive(pathname);
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

  markNavLinkActive(pathname: string) {
    this.root.querySelector(".nav-item.active")?.classList.remove("active");
    if (pathname.includes("cart")) {
      this.root.querySelector(".nav-item-cart")?.classList.add("active");
    } else if (pathname.includes("products")) {
      console.log("products");
      this.root.querySelector(".nav-item-products")?.classList.add("active");
    } else {
      this.root.querySelector(".nav-item-home")?.classList.add("active");
    }
  }
}

customElements.define("app-nav", Navigation);
