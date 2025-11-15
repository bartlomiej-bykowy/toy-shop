export type Product = {
  id: number;
  name: string;
  desc: string;
  img: string;
  price: number;
};

export async function loadProducts(): Promise<Product[]> {
  const data = await fetch("/src/data/products.json");
  const products: Product[] = await data.json();
  return products;
}
