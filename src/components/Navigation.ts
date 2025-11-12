import { loadTemplate } from "../utils/renderTemplate";

type NavLink = { text: string; icon: string };

export class Navigation extends HTMLElement {
  links: NavLink[];
  root: ShadowRoot;

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

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
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
    const lowerText = text.toLocaleLowerCase();
    return `<li class="nav-item nav-item-${lowerText}"><a href="/${lowerText}">${icon} ${text}</a></li>`;
  }
}

customElements.define("app-nav", Navigation);
