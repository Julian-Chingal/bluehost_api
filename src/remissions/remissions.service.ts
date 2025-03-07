import { BadRequestError, CustomError, NotFoundError } from "../middlewares";
import { IUpdateRemissions, IGetRemissions } from "./remissions.models";
import { Pool } from "../config";

export class RemissionService {
    /**
     * Retorna las remisiones que estan en estado 'EN RUTA'
     * @returns {Promise<Array<GetRemissionsDto> | {message: string}>} Lista de remisiones o un mensaje si no hay remisiones
     */
    static async getRemissions(): Promise<Array<IGetRemissions> | { message: string }> {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT no_remision, fecha_hora_cargue, placa_carro, cedula_conductor, nombre_conductor, producto, estado, transportadoras.nit as nit_empresa_transportadora,  empresa_transportadora 
            FROM remisiones 
            INNER JOIN transportadoras ON remisiones.empresa_transportadora = transportadoras.nombre_empresa
            WHERE estado = 'EN RUTA' OR estado = 'ENTURNADO';`;
            Pool.query(query, (err, result) => {
                if (err) reject(new BadRequestError("Error getting remissions"));
                if (result.length === 0) resolve({ message: "Remissions is empty" });
                resolve(result);
            })
        })
    }

    /**
     * Trae la remisión por el número de remisión.
     * @param {string} remissionNumber - Número de la remisión.
     * @returns {Promise<GetRemissionsDto>} Detalles de la remisión.
     */
    static async getRemissionByNumber(remissionNumber: string): Promise<IGetRemissions> {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT no_remision, fecha_hora_cargue, placa_carro, cedula_conductor, nombre_conductor, producto, estado,  transportadoras.nit AS nit_empresa_transportadora, empresa_transportadora 
            FROM remisiones 
            INNER JOIN transportadoras ON remisiones.empresa_transportadora = transportadoras.nombre_empresa
            WHERE no_remision = ? 
            AND estado = 'EN RUTA' OR estado = 'ENTURNADO' 
            ORDER BY no_remision DESC LIMIT 1;`;
            Pool.query(query, [remissionNumber], (err, result) => {
                if (err) reject(new BadRequestError("Error getting remissions by remissionNumber"));
                if (result.length === 0) reject(new NotFoundError("Remission not found"));
                resolve(result);
            })
        })
    }

    /**
  * Trae la fecha de la remisión por el número de remisión.
  * @param {string} remissionNumber - Número de la remisión.
  * @returns {Promise<{fecha_hora: string}>} Fecha de la remisión.
  */
    static async getDateByRemissionNumber(remissionNumber: string): Promise<{ fecha_hora: string }> {
        return new Promise((resolve, reject) => {
            const query = `SELECT fecha_hora FROM eventos WHERE no_remision = ? AND evento LIKE '%EN TERMINAL%' ORDER BY id DESC LIMIT 1;`;
            Pool.query(query, [remissionNumber], (err, result) => {
                if (err) reject(new BadRequestError("Error getting date remission by remissionNumber"));
                if (result.length === 0) reject(new NotFoundError("Remission not found"));
                resolve(result);
            })
        })
    }

    /**
    * Actualiza la remisión.
    * @param {IUpdateRemissions} body - Datos para actualizar la remisión.
    * @returns {Promise<{message: string}>} Mensaje de éxito.
    * @throws {BadRequestError} Si el token es inválido o la condición de estado o terminal no es válida.
    * @throws {CustomError} Si no se pudo actualizar la remisión.
    */
    static async updateRemission(body: IUpdateRemissions): Promise<{ message: string }> {
        const { estado, noremision, terminal } = body;

        let resp: number;
        if (estado === "ENTURNADO") {
            resp = await updateState(noremision);
        } else if (estado === "SOLICITADO" && terminal === "PALERMO") {
            resp = await updateAllowed(noremision, terminal); // La validación de ENTURNADO ya está en la consulta
        } else {
            throw new BadRequestError("Condición de estado o terminal no válida");
        }

        if (resp >= 1) {
            return { message: `Remisión No ${noremision} actualizada con éxito` };
        } else {
            throw new CustomError('No se pudo actualizar la remisión', 500);
        }
    }
}


/**
 * Actualiza el estado de la remisión.
 * @param {string} noremision - Número de la remisión.
 * @param {string} estado - Nuevo estado de la remisión.
 * @returns {Promise<number>} Número de filas afectadas.
 * @throws {BadRequestError} Si hay un error al actualizar el estado.
 */
async function updateState(noremision: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `UPDATE remisiones SET estado = "ENTURNADO" WHERE no_remision = ?;`;
        Pool.query(query, noremision, (err, result) => {
            if (err) reject(new BadRequestError("Error updating allowed"));
            resolve(result.affectedRows);
        })
    })
}

/**
 * Actualiza el permiso de la terminal.
 * @param {string} noremision - Número de la remisión.
 * @param {string} terminal - Terminal de la remisión.
 * @returns {Promise<number>} Número de filas afectadas.
 * @throws {BadRequestError} Si hay un error al actualizar el permiso.
 */
async function updateAllowed(noremision: string, terminal: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE remisiones 
            SET ingreso_zf = "PERMITIDO" 
            WHERE no_remision = ? 
            AND terminal = ? 
            AND estado = "ENTURNADO";
        `;
        Pool.query(query, [noremision, terminal], (err, result) => {
            if (err) reject(new BadRequestError("Error updating allowed"));
            if (result.affectedRows === 0) {
                reject(new BadRequestError("El estado no es ENTURNADO o la remisión no existe"));
            }
            resolve(result.affectedRows);
        });
    });
}