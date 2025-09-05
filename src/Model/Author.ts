import Database from './Database.js';
import { AbstractModel } from './AbstractModel.js';
import type { Author as PrismaAuthor } from '../generated/prisma/client.js';

export default class Author extends AbstractModel {
    public nome: string;
    public email: string;
    public bio: string;
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor(nome: string = '', email: string = '', bio: string = '') {
        super();
        this.nome = nome;
        this.email = email;
        this.bio = bio;
    }

    public async load(id?: number): Promise<Author | null> {
        const authorId = id ?? this.id;
        if (!authorId) return null;

        const author = await Database.prisma.author.findUnique({ where: { id: authorId } });
        if (!author) return null;

        const loaded = Author.fromPrisma(author);
        Object.assign(this, loaded);
        return this;
    }

    public async save(): Promise<Author> {
        const data = { nome: this.nome, email: this.email, bio: this.bio };
        const author = this.id
            ? await Database.prisma.author.update({ where: { id: this.id }, data })
            : await Database.prisma.author.create({ data });

        return Author.fromPrisma(author);
    }

    public async delete(): Promise<boolean> {
        if (!this.id) return false;
        try {
            await Database.prisma.author.delete({ where: { id: this.id } });
            return true;
        } catch {
            return false;
        }
    }

    public static async findAll(): Promise<Author[]> {
        const authors = await Database.prisma.author.findMany();
        return authors.map(Author.fromPrisma);
    }

    public static async findById(id: number): Promise<Author | null> {
        const author = await Database.prisma.author.findUnique({ where: { id } });
        return author ? Author.fromPrisma(author) : null;
    }

    public static fromPrisma(prismaAuthor: PrismaAuthor): Author {
        const author = new Author(prismaAuthor.nome, prismaAuthor.email, prismaAuthor.bio);
        author.id = prismaAuthor.id;
        author.createdAt = prismaAuthor.createdAt;
        author.updatedAt = prismaAuthor.updatedAt;
        return author;
    }
}
