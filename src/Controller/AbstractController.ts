import { type Request, type Response } from 'express';

export abstract class AbstractController {
    protected request: Request;
    protected response: Response;

    constructor(request: Request, response: Response) {
        this.request = request;
        this.response = response;
    }

    public abstract execute(): Promise<void> | void;

    public getParams(): any {
        return {
            ...this.request.params,
            ...this.request.query,
            ...this.request.body
        };
    }

    public getMethod(): string {
        return this.request.method;
    }
}
