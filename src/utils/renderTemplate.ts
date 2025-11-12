export async function loadTemplate(name: string): Promise<DocumentFragment> {
  const [html, css] = await Promise.all([
    fetch(`/templates/${name}.html`).then((r) => r.text()),
    fetch(`/styles/${name}.css`).then((r) => r.text()),
  ]);

  const template = document.createElement("template");
  template.innerHTML = `<style>${css}</style>${html}`;

  return template.content.cloneNode(true) as DocumentFragment;
}
