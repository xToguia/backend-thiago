const User = require("./user");
const path = require('path'); //modulo para manipular caminhos
const fs = require('fs'); // modulo para manipular arquivos files system
const bcrypt = require('bcryptjs');
const mysql = require("./mysql");

class userService {

    async addUser(nome, email, senha, endereco, telefone, cpf) {
        try {
            const cpfexistente = this.users.some(user => user.cpf === cpf);
            if (cpfexistente) {
                throw new Error("CPF já cadastrado");
            }
            const senhaCripto = await bcrypt.hash(senha, 10);
            const user = new User(this.nextId++, nome, email, senhaCripto, endereco, telefone, cpf); // ++ vai adicionar mais 1 no número do id a cada novo usuário, que inicialmente é 1.
            this.users.push(user);
            this.saveUsers();
            return user;
        } catch (erro) {
            console.log("Erro ao adicionar usuário", erro);
            throw erro;
        }
    }

    async getUser(id) {
        try {
            const resultado = await mysql.execute(
            `SELECT idUsuario FROM usuarios WHERE idUsuario = ?`,
            [id]
        );
        console.log("resultado", resultado);
        return resultado;
        } catch (erro) {
            console.log("Erro ao buscar usuário", erro);
        }

    }
    async deleteUser(id) {
        try {
            const user = await this.getUser(id);
            if (user.length == 0) {
                console.log("Usuário não existe");
                return;
            }
            const resultado = await mysql.execute(
                `DELETE FROM usuarios WHERE idUsuario = ?`,
                [id]
            );
            return resultado;
        } catch (erro) {
            console.log("Erro ao deletar o usuário", erro);
        }
    }

    async updateUser(id, nome, email, senha, endereco, telefone, cpf) {
    }
}

module.exports = new userService();