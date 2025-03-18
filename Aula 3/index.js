const express = require('express');
const UserService = require('./userService'); // Importa o serviço de usuários
const app = express();

app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

// Instancia o serviço de usuários com o caminho do arquivo JSON
const userService = new UserService('./users.json');

// Rota para adicionar um novo usuário
app.post("/users", (req, res) => {
    const { nome, email, senha, endereco, telefone, cpf } = req.body;
    if (!nome || !email || !senha || !endereco || !telefone || !cpf) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    try {
        const user = userService.addUser(nome, email, senha, endereco, telefone, cpf);
        res.status(201).json({ user });
    } catch (erro) {
        res.status(500).json({ error: "Erro ao adicionar usuário", details: erro.message });
    }
});

// Rota para listar todos os usuários
app.get("/users", (req, res) => {
    try {
        const users = userService.getUsers();
        res.status(200).json(users);
    } catch (erro) {
        res.status(500).json({ error: "Erro ao listar usuários", details: erro.message });
    }
});

// Rota para deletar um usuário pelo ID
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const resultado = userService.deleteUser(id); // Certifique-se de implementar este método no userService.js
        res.status(200).json(resultado);
    } catch (erro) {
        res.status(404).json({ error: erro.message });
    }
});

// Inicia o servidor na porta 3000
const port = 3000;
app.listen(port, () => {
    console.log("Servidor rodando na porta: ", port);
});