import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@loja.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@loja.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("cliente123", 10);
  await prisma.user.upsert({
    where: { email: "cliente@teste.com" },
    update: {},
    create: {
      name: "Cliente Teste",
      email: "cliente@teste.com",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const products = [
    {
      name: "Fone de Ouvido Bluetooth",
      description: "Fone sem fio com cancelamento de ruído e 30h de bateria.",
      price: 249.9,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      category: "Eletrônicos",
    },
    {
      name: "Teclado Mecânico RGB",
      description: "Teclado mecânico switch marrom, iluminação RGB customizável.",
      price: 349.0,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1595225476474-1c0c0a4c8b3a?w=600",
      category: "Eletrônicos",
    },
    {
      name: "Camiseta Básica Algodão",
      description: "Camiseta 100% algodão, corte reto, várias cores.",
      price: 59.9,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
      category: "Vestuário",
    },
    {
      name: "Garrafa Térmica 1L",
      description: "Mantém a temperatura por até 12 horas. Aço inox.",
      price: 89.9,
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
      category: "Casa",
    },
    {
      name: "Mochila para Notebook",
      description: "Compartimento acolchoado para notebooks até 15.6\".",
      price: 179.9,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
      category: "Acessórios",
    },
    {
      name: "Luminária de Mesa LED",
      description: "Luminária com 3 níveis de intensidade e porta USB.",
      price: 119.9,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
      category: "Casa",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Seed concluído: 2 usuários e 6 produtos criados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
