import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express(); //chamando o express pra ser usado, nao adianta só importar

app.use(express.json());

app.post("/users", async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      phone: req.body.phone,
    },
  });
  res.status(201).json(req.body);
});

app.patch("/users/:id", async (req, res) => {
  const { email, name, age, phone } = req.body;

  if (!email && !name && !age && !phone) {
    return res.status(400).json({ error: "Nenhum dado para atualizar." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(age && { age: parseInt(age) }),
        ...(phone && { phone }),
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao atualizar o usuário.", details: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    let users = [];

    if (Object.keys(req.query).length > 0) {
      users = await prisma.user.findMany({
        where: {
          ...(req.query.email && { email: req.query.email }),
          ...(req.query.name && { name: req.query.name }),
          ...(req.query.age && { age: parseInt(req.query.age) }), // Converte para número
          ...(req.query.phone && { phone: req.query.phone }),
        },
      });
    } else {
      users = await prisma.user.findMany();
    }

    res.status(200).json(users);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao buscar usuários.", details: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.status(200).json({ message: "Usuário deletado!" });
});

app.listen(3000);
//genericapi
//genericapi123
