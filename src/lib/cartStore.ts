import { map, computed } from 'nanostores';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export const isCartOpen = map<boolean>(false);
export const cartItems = map<Record<string, CartItem>>({});

export const cartCount = computed(cartItems, (items) => {
  return Object.values(items).reduce((acc, item) => acc + item.quantity, 0);
});

export const cartTotal = computed(cartItems, (items) => {
  return Object.values(items).reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

export function addToCart(product: Omit<CartItem, 'quantity'>) {
  const currentItems = cartItems.get();
  const existingItem = currentItems[product.id];

  if (existingItem) {
    cartItems.setKey(product.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1
    });
  } else {
    cartItems.setKey(product.id, {
      ...product,
      quantity: 1
    });
  }
  isCartOpen.set(true);
}

export function removeFromCart(id: string) {
  const currentItems = cartItems.get();
  const { [id]: removed, ...rest } = currentItems;
  cartItems.set(rest);
}

export function updateQuantity(id: string, quantity: number) {
  const currentItems = cartItems.get();
  const item = currentItems[id];
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      cartItems.setKey(id, { ...item, quantity });
    }
  }
}

export function toggleCart() {
  isCartOpen.set(!isCartOpen.get());
}
