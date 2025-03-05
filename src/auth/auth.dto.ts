export class AuthDto {
    constructor(
        public username: string,
        public password: string
    ) { }
}

export interface IUser {
    UsuarioId?: string
    Usuario: string;
    Password: string;
    Estado: string
}