import Database from './Database.js';
import { AbstractModel } from './AbstractModel.js';
import type { Tag as PrismaTag } from '../generated/prisma/client.js';

export default class Tag extends AbstractModel {
    public nome: string;
    public cor: string;
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor(nome: string = '', cor: string = '#007bff') {
        super();
        this.nome = nome;
        this.cor = cor;
    }

    public async load(id: number): Promise<Tag | null> {
        const tag = await Database.prisma.tag.findUnique({ where: { id } });
        if (!tag) return null;
        this.id = tag.id;
        this.nome = tag.nome;
        this.cor = tag.cor;
        this.createdAt = tag.createdAt;
        this.updatedAt = tag.updatedAt;
        return this;
    }

    public async save(): Promise<Tag> {
        if (!this.nome || this.nome.trim() === '') {
            throw new Error('O nome da tag é obrigatório');
        }

        if (this.id) {
            const updated = await Database.prisma.tag.update({
                where: { id: this.id },
                data: { nome: this.nome, cor: this.cor }
            });
            return Tag.fromPrisma(updated);
        } else {
            const created = await Database.prisma.tag.create({
                data: { nome: this.nome, cor: this.cor }
            });
            return Tag.fromPrisma(created);
        }
    }

    public async delete(): Promise<boolean> {
        if (!this.id) return false;
        try {
            await Database.prisma.tag.delete({ where: { id: this.id } });
            return true;
        } catch {
            return false;
        }
    }

    public static async findAll(): Promise<Tag[]> {
        const tags = await Database.prisma.tag.findMany();
        return tags.map(Tag.fromPrisma);
    }

    public static async findById(id: number): Promise<Tag | null> {
        const tag = await Database.prisma.tag.findUnique({ where: { id } });
        return tag ? Tag.fromPrisma(tag) : null;
    }

    public static fromPrisma(prismaTag: PrismaTag): Tag {
        const tag = new Tag(prismaTag.nome, prismaTag.cor);
        tag.id = prismaTag.id;
        tag.createdAt = prismaTag.createdAt;
        tag.updatedAt = prismaTag.updatedAt;
        return tag;
    }
}
