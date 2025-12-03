import { productsStore, type Product } from "../store";

export async function loadProducts(): Promise<void> {
  const data = await fetch("/src/data/products.json");
  const products: Product[] = await data.json();
  productsStore.loadProducts(products);
}
