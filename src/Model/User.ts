import Database from './Database.js';
import { AbstractModel } from './AbstractModel.js';
import type { User as PrismaUser, Post as PrismaPost } from '../generated/prisma/client.js';
import Post from './Post.js';

export default class User extends AbstractModel {
    public nome: string;
    public posts: Post[];
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor(nome: string = '', posts: Post[] = []) {
        super();
        this.nome = nome;
        this.posts = posts;
    }

    public async load(id: number): Promise<User | null> {
        const user = await Database.prisma.user.findUnique({
            where: { id },
            include: { posts: true }
        });

        return user ? User.fromPrisma(user) : null;
    }

    public async save(): Promise<User> {
        if (this.id) {
            const updated = await Database.prisma.user.update({
                where: { id: this.id },
                data: { nome: this.nome },
                include: { posts: true }
            });
            return User.fromPrisma(updated);
        } else {
            const created = await Database.prisma.user.create({
                data: { nome: this.nome },
                include: { posts: true }
            });
            return User.fromPrisma(created);
        }
    }

    public async delete(): Promise<boolean> {
        if (!this.id) return false;

        try {
            await Database.prisma.user.delete({ where: { id: this.id } });
            return true;
        } catch {
            return false;
        }
    }

    public static async create(nome: string): Promise<User> {
        const prismaUser = await Database.prisma.user.create({
            data: { nome },
            include: { posts: true }
        });
        return User.fromPrisma(prismaUser);
    }

    public static async findAll(): Promise<User[]> {
        const users = await Database.prisma.user.findMany({
            include: { posts: true }
        });

        const result = await Promise.all(
            users.map((user) => User.fromPrisma(user))
        );

        return result;
    }

    public static async findById(id: number): Promise<User | null> {
        const prismaUser = await Database.prisma.user.findUnique({
            where: { id },
            include: { posts: true }
        });

        return prismaUser ? User.fromPrisma(prismaUser) : null;
    }

    private static async fromPrisma(
        prismaUser: PrismaUser & { posts?: PrismaPost[] }
    ): Promise<User> {
        const posts: Post[] = prismaUser.posts
            ? await Promise.all(
                prismaUser.posts.map(async (p) => {
                    const postWithRelations = await Database.prisma.post.findUnique({
                        where: { id: p.id },
                        include: {
                            user: true,
                            author: true,
                            category: true,
                            tags: { include: { tag: true } }
                        }
                    });
                    if (!postWithRelations) throw new Error("Post não encontrado");
                    return Post.fromPrisma(postWithRelations);
                })
            )
            : [];

        const user = new User(prismaUser.nome, posts);
        user.id = prismaUser.id;
        user.createdAt = prismaUser.createdAt;
        user.updatedAt = prismaUser.updatedAt;

        return user;
    }

}
