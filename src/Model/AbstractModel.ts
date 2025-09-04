import Database from './Database.js';

export abstract class AbstractModel {
    protected id?: number;

    constructor() {
    }

    public abstract load(...args: any[]): Promise<AbstractModel | null>;

    public abstract save(): Promise<AbstractModel>;

    public abstract delete(): Promise<boolean>;

    public getId(): number | undefined {
        return this.id;
    }
}
