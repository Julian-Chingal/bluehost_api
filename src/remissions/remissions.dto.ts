interface IRemissions {
    id: number;
}

export class GetRemissionsDto implements IRemissions {
    constructor(
        public id: number
    ) {

    }
}

export class UpdateRemissionsDto {
    constructor(
        public estado: string,
        public terminal: string,
        public usuario: string,
        public nombre: string,
        public token: string,
        public noremision: string,
    ) {}
}