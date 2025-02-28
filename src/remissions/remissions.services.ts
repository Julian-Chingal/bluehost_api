// import { RemissionsDto } from "./remissions.dto";
import { BadRequestError, CustomError, NotFoundError } from "../middlewares";
import pool from "../db/conection";
import { UpdateRemissionsDto } from "./remissions.dto";

export class RemissionService {
    // Trae todas las remisiones en ruta
    static async getRemissions() {
        return new Promise((resolve, reject) => {
            const query = "SELECT no_remision,fecha_hora_cargue,placa_carro,cedula_conductor,nombre_conductor,producto FROM remisiones WHERE estado = 'EN RUTA';";
            pool.query(query, (err, result) => {
                if (err) reject(new BadRequestError("Error getting remissions"));
                if (result.length === 0) resolve({ message: "Remissions is empty" });
                resolve(result);
            })
        })
    }

    // Trae la remision por el numero de remision
    static async getRemissionByNumber(remissionNumber: string) {
        return new Promise((resolve, reject) => {
            const query = `SELECT no_remision,fecha_hora_cargue,placa_carro,cedula_conductor,nombre_conductor,producto FROM remisiones WHERE no_remision = ? ORDER BY id DESC LIMIT 1;`;
            pool.query(query, [remissionNumber], (err, result) => {
                if (err) reject(new BadRequestError("Error getting remissions by remissionNumber"));
                if (result.length === 0) reject(new NotFoundError("Remission not found"));
                resolve(result);
            })
        })
    }

    // Trae la fecha de la remision por el numero de remision
    static async getDateByRemissionNumber(remissionNumber: string) {
        return new Promise((resolve, reject) => {
            const query = `SELECT fecha_hora FROM eventos WHERE no_remision = ? AND evento LIKE '%EN TERMINAL%' ORDER BY id DESC LIMIT 1;`;
            pool.query(query, [remissionNumber], (err, result) => {
                if (err) reject(new BadRequestError("Error getting date remission by remissionNumber"));
                if (result.length === 0) reject(new NotFoundError("Remission not found"));
                resolve(result);
            })
        })
    }

    // Actualiza la remision
    static async updateRemission(body: UpdateRemissionsDto) {

        const { estado, token, noremision, terminal } = body;
        const tokenValid = validateToken(token);
        if (!tokenValid) throw new BadRequestError("Token invalid")

        let resp: number;
        if (estado === 'ENTURNADO') {
            resp = await updateState(noremision, estado);
        } else if (estado === 'SOLICITADO' && terminal === 'PALERMO') {
            resp = await  updateAllowed(noremision, terminal);
        } else {
            throw new BadRequestError('Condición de estado o terminal no válida');
        }

        if (resp >= 1) {
            return { message: `Remision No ${noremision} actualizada con exito` };
        } else {
            throw new CustomError('No se pudo actualizar la remisión', 500);
        }
    }
}

// Valida el token
async function validateToken(token: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `SELECT TokenId,UsuarioId,Estado FROM usuarios_token WHERE Token = ? AND estado = "Activo";`;
        pool.query(query, [token], (error, results) => {
            if (error) {
                reject(new BadRequestError("Error getting token"));
            }
            if (results.length === 0) {
                reject(new NotFoundError("Token not found"));
            }
            resolve(results);
        })
    })
}

// Actualiza el estado de la remision
async function updateState(noremision: string, estado: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `UPDATE remisiones SET estado = ? WHERE no_remision = ?;`;
        pool.query(query, [estado, noremision], (err, result) => {
            if (err) return reject(new BadRequestError("Error updating allowed"));
            resolve(result.affectedRows);
        })
    })
}

// Actualiza el permiso de la terminal
async function updateAllowed(noremision: string, terminal: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `UPDATE remisiones SET ingreso_zf = "PERMITIDO" WHERE no_remision = ? AND terminal = ?;`;
        pool.query(query, [terminal, noremision], (err, result) => {
            if (err) return reject(new BadRequestError("Error updating allowed"));
            resolve(result.affectedRows);
        })
    })
}