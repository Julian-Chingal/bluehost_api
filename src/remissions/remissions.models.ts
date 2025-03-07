export interface IGetRemissions {
    no_remision: number;
    fecha_hora_cargue: string;
    placa_carro: string;
    cedula_conductor: string;
    nombre_conductor: string;
    producto: string;
    'acidez_extractora_%': number;
    estado: string;
    nit_empresa_transportadora: string;
    empresa_transportadora: string;
}

export interface IUpdateRemissions {
    estado: string;
    terminal: string;
    usuario: string;
    nombre: string;
    noremision: string;
}