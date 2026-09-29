import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/lib/cartStore";

const sampleItem = {
  productId: "prod-1",
  name: "Produto Teste",
  price: 100,
  imageUrl: "https://example.com/img.jpg",
  quantity: 1,
};

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adiciona um item novo ao carrinho", () => {
    useCartStore.getState().addItem(sampleItem);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("soma a quantidade se o item já existir no carrinho", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem(sampleItem);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("atualiza a quantidade de um item existente", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().updateQuantity("prod-1", 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("remove o item quando a quantidade cai para zero ou menos", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().updateQuantity("prod-1", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("remove um item explicitamente", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().removeItem("prod-1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calcula o total de itens corretamente", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem({ ...sampleItem, productId: "prod-2" });
    expect(useCartStore.getState().totalItems()).toBe(2);
  });

  it("calcula o preço total corretamente", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem({ ...sampleItem, productId: "prod-2", price: 50 });
    expect(useCartStore.getState().totalPrice()).toBe(150);
  });

  it("limpa o carrinho inteiro", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
