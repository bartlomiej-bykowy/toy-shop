import { defineStore } from "@bartlomiej-bykowy/toy-store";

export type Product = {
  id: number;
  name: string;
  desc: string;
  img: string;
  price: number;
};
type ProductsState = { products: Product[]; cart: Product[] };
type Getters<S> = {
  productsInCart: (state: S) => number;
};
type Actions = {
  loadProducts: (products: Product[]) => void;
  addToCart: (products: Product[]) => void;
  removeFromCart: (id: number) => Product[];
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
      this.$state.cart = [...this.$state.cart, ...products];
    },
    removeFromCart(id: number) {
      const newCart = this.$state.cart.filter((product) => product.id !== id);
      this.$state.cart = newCart;
      return newCart;
    },
    clearCart() {
      this.$state.cart = [];
    },
  },
});

export const productsStore = useProductsStore();
