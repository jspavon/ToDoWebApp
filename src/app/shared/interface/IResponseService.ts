export interface IResponseService<T>{
    status: number;
    message: string;
    data: T | null;
}