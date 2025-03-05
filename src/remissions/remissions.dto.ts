export class GetRemissionsDto {
    constructor(
        public no_remision: string,
        public fecha_hora_cargue: string,
        public placa_carro: string,
        public cedula_conductor: string,
        public nombre_conductor: string,
        public producto: string,
    ) { }
}

export class UpdateRemissionsDto {
    constructor(
        public estado: string,
        public terminal: string,
        public usuario: string,
        public nombre: string,
        public token: string,
        public noremision: string,
    ) { }
}