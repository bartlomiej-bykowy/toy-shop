import { loadTemplate } from "../utils/renderTemplate";

export class HomePage extends HTMLElement {
  root: ShadowRoot;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const template = await loadTemplate("home-page");

    this.root.appendChild(template);
  }
}

customElements.define("app-home-page", HomePage);
