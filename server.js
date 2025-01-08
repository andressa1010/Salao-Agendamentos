import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Bem vindo ao agendamento de salão");
});

app.get("/agendamentos", async (req, res) => {
  const listaDeAgendamentos = await prisma.agendamento.findMany();

  res.status(200).json(listaDeAgendamentos);
});

app.post("/agendamentos", async (req, res) => {
  const { cliente, servico, data } = req.body;

  const novoAgendamento = await prisma.agendamento.create({
    data: {
      cliente,
      servico,
      data,
    },
  });

  res.status(201).json(novoAgendamento);
});

app.put("/agendamentos/:id", async (req, res) => {
  const { id } = req.params;
  const { cliente, servico, data } = req.body;

  try {
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: {
        cliente,
        servico,
        data,
      },
    });

    res.status(200).json(agendamentoAtualizado);
  } catch (error) {
    res.status(404).json({ error: "Agendamento não encontrado" });
  }
});

app.delete("/agendamentos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.agendamento.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Agendamento cancelado com sucesso" });
  } catch (error) {
    res.status(404).json({ error: "Agendamento não encontrado" });
  }
});

app.listen(3001, () => {
  console.log("Servidor em execução na porta http://localhost:3001/");
});
