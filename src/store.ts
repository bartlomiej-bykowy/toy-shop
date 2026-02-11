import { defineStore } from "@bartlomiej-bykowy/toy-store";

export type Product = {
  id: number;
  name: string;
  desc: string;
  img: string;
  price: number;
};
export type CartProduct = Product & {
  cartId: string;
};
type ProductsState = { products: Product[]; cart: CartProduct[] };
type Getters<S> = {
  productsInCart: (state: S) => number;
};
type Actions = {
  loadProducts: (products: Product[]) => void;
  addToCart: (products: Product[]) => void;
  removeFromCart: (id: string) => CartProduct[];
  clearCart: () => void;
};

const useProductsStore = defineStore<
  ProductsState,
  Getters<ProductsState>,
  Actions
>({
  id: "test",
  state: () => ({
    products: [],
    cart: [],
  }),
  getters: {
    productsInCart: (state) => state.cart.length,
  },
  actions: {
    loadProducts(products: Product[]) {
      this.$state.products = products;
    },
    addToCart(products: Product[]) {
      // we need to add some unique identifier for every item in the cart. Otherwise we could end up with multiple same items (with the same id) and removing one would remove all of them
      const productsWithCartId = products.map((product) => ({
        cartId: crypto.randomUUID(),
        ...product,
      }));
      this.$state.cart = [...this.$state.cart, ...productsWithCartId];
    },
    removeFromCart(id: string) {
      const newCart = this.$state.cart.filter(
        (product) => product.cartId !== id
      );
      this.$state.cart = newCart;
      return newCart;
    },
    clearCart() {
      this.$state.cart = [];
    },
  },
});

export const productsStore = useProductsStore();
