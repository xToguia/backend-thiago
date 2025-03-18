class User {
    constructor(id, nome, email, senha, endereco, telefone, cpf) {
        if (!id || !nome || !email || !senha || !endereco || !telefone || !cpf) {
            throw new Error("Todos os campos são obrigatórios");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.endereco = endereco;
        this.telefone = telefone;
        this.cpf = cpf;
    }
}

module.exports = User;