// src/Model/Database.ts
import { PrismaClient } from "../generated/prisma/client.js";

export default class Database {
    public static prisma: PrismaClient = new PrismaClient();

    private constructor() {}

    public static async connect(): Promise<void> {
        try {
            await this.prisma.$connect();
            console.log("Conexão com o banco de dados estabelecida com sucesso.");
        } catch (error) {
            console.error("Erro ao conectar ao banco de dados:", error);
            process.exit(1);
        }
    }


}
