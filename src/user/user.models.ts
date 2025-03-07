export interface ICreatedUser {
    UsuarioId: number;
    Usuario: string;
    Password: string;
    Estado: string
}

export interface IUser {
    UsuarioId: number;
    Usuario: string;
    Estado: string
}

export interface ICreateUser {
    Usuario: string;
    Password: string;
    Estado?: string
}