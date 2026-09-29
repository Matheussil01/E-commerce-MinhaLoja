import { test, expect } from "@playwright/test";

test.describe("Fluxo de compra", () => {
  test("visitante consegue ver a listagem de produtos", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Bem-vindo à MinhaLoja")).toBeVisible();
  });

  test("cliente consegue logar, adicionar item ao carrinho e ver o total", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("cliente@teste.com");
    await page.getByPlaceholder("Senha").fill("cliente123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL("/");

    // Abre o primeiro produto da listagem
    await page.locator("a[href^='/product/']").first().click();
    await page.getByRole("button", { name: /Adicionar ao carrinho/ }).click();

    await page.goto("/cart");
    await expect(page.getByText("Resumo")).toBeVisible();
    await expect(page.getByText("Finalizar compra")).toBeVisible();
  });

  test("admin consegue acessar o painel e ver o dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("admin@loja.com");
    await page.getByPlaceholder("Senha").fill("admin123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.goto("/admin");
    await expect(page.getByText("Dashboard")).toBeVisible();
    await expect(page.getByText("Faturamento total")).toBeVisible();
  });

  test("cliente comum não consegue acessar o painel admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("cliente@teste.com");
    await page.getByPlaceholder("Senha").fill("cliente123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.goto("/admin");
    await expect(page).toHaveURL("/");
  });
});
