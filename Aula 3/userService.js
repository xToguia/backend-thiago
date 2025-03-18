const User = require("./user");
const path = require("path"); // Módulo para manipular caminhos
const fs = require("fs"); // Módulo para manipular arquivos (file system)

class UserService {
    constructor() {
        this.filePath = path.join(__dirname, "users.json"); // Caminho do arquivo JSON
        this.users = this.loadUsers(); // Carrega os usuários do arquivo
        this.nextId = this.getNextId(); // Inicializa o próximo ID
    }

    // Carrega os usuários do arquivo JSON
    loadUsers() {
        try {
            if (fs.existsSync(this.filePath)) { // Verifica se o arquivo existe
                const data = fs.readFileSync(this.filePath, "utf-8"); // Lê o arquivo
                return JSON.parse(data); // Transforma o JSON em objeto
            }
        } catch (erro) {
            console.log("Erro ao carregar arquivo:", erro.message);
        }
        return []; // Retorna um array vazio se o arquivo não existir ou houver erro
    }

    // Calcula o próximo ID
    getNextId() {
        try {
            if (this.users.length === 0) return 1; // Se não houver usuários, retorna 1
            return Math.max(...this.users.map(user => user.id)) + 1; // Retorna o maior ID + 1
        } catch (erro) {
            console.log("Erro ao calcular próximo ID:", erro.message);
            return 1; // Retorna 1 como fallback
        }
    }

    // Salva os usuários no arquivo JSON
    saveUsers() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2)); // Salva o arquivo formatado
        } catch (erro) {
            console.log("Erro ao salvar arquivo:", erro.message);
        }
    }

    // Adiciona um novo usuário
    addUser(nome, email, senha, endereco, telefone, cpf) {
        try {
            const user = new User(this.nextId++, nome, email, senha, endereco, telefone, cpf); // Cria um novo usuário
            this.users.push(user); // Adiciona ao array de usuários
            this.saveUsers(); // Salva no arquivo
            return user; // Retorna o usuário criado
        } catch (erro) {
            console.log("Erro ao adicionar usuário:", erro.message);
        }
    }

    // Retorna todos os usuários
    getUsers() {
        try {
            return this.users; // Retorna o array de usuários
        } catch (erro) {
            console.log("Erro ao buscar usuários:", erro.message);
            return []; // Retorna um array vazio em caso de erro
        }
    }

    // Deleta um usuário pelo ID
    deleteUser(id) {
        try {
            const userIndex = this.users.findIndex(user => user.id === id); // Encontra o índice do usuário
            if (userIndex === -1) {
                throw new Error("Usuário não encontrado"); // Lança erro se o usuário não existir
            }
            const deletedUser = this.users.splice(userIndex, 1); // Remove o usuário do array
            this.saveUsers(); // Salva as alterações no arquivo
            return { message: "Usuário deletado com sucesso", user: deletedUser[0] }; // Retorna o usuário deletado
        } catch (erro) {
            console.log("Erro ao deletar usuário:", erro.message);
            throw erro; // Relança o erro para ser tratado na rota
        }
    }
}

module.exports = new UserService();