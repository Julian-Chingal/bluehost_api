import { BadRequestError, CustomError, NotFoundError } from "../middlewares";
import { UpdateRemissionsDto, GetRemissionsDto } from "./remissions.dto";
import pool from "../db/conection";

export class RemissionService {
   /**
    * Retorna las remisiones que estan en estado 'EN RUTA'
    * @returns {Promise<Array<GetRemissionsDto> | {message: string}>} Lista de remisiones o un mensaje si no hay remisiones
    */
    static async getRemissions(): Promise<Array<GetRemissionsDto> | { message: string }> {
        return new Promise((resolve, reject) => {
            const query = "SELECT no_remision,fecha_hora_cargue,placa_carro,cedula_conductor,nombre_conductor,producto FROM remisiones WHERE estado = 'EN RUTA';";
            pool.query(query, (err, result) => {
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
    static async getRemissionByNumber(remissionNumber: string): Promise<GetRemissionsDto> {
        return new Promise((resolve, reject) => {
            const query = `SELECT no_remision,fecha_hora_cargue,placa_carro,cedula_conductor,nombre_conductor,producto FROM remisiones WHERE no_remision = ? ORDER BY id DESC LIMIT 1;`;
            pool.query(query, [remissionNumber], (err, result) => {
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
            pool.query(query, [remissionNumber], (err, result) => {
                if (err) reject(new BadRequestError("Error getting date remission by remissionNumber"));
                if (result.length === 0) reject(new NotFoundError("Remission not found"));
                resolve(result);
            })
        })
    }

     /**
     * Actualiza la remisión.
     * @param {UpdateRemissionsDto} body - Datos para actualizar la remisión.
     * @returns {Promise<{message: string}>} Mensaje de éxito.
     * @throws {BadRequestError} Si el token es inválido o la condición de estado o terminal no es válida.
     * @throws {CustomError} Si no se pudo actualizar la remisión.
     */
    static async updateRemission(body: UpdateRemissionsDto): Promise<{ message: string }> {
        const { estado, token, noremision, terminal } = body;

        const tokenValid = await validateToken(token);
        if (!tokenValid) {
            throw new BadRequestError("Token invalid");
        }

        let resp: number;
        if (estado === 'ENTURNADO') {
            resp = await updateState(noremision, estado);
        } else if (estado === 'SOLICITADO' && terminal === 'PALERMO') {
            resp = await updateAllowed(noremision, terminal);
        } else {
            throw new BadRequestError('Condición de estado o terminal no válida');
        }

        if (resp >= 1) {
            return { message: `Remisión No ${noremision} actualizada con éxito` };
        } else {
            throw new CustomError('No se pudo actualizar la remisión', 500);
        }
    }
}

/**
 * Valida el token.
 * @param {string} token - Token a validar.
 * @returns {Promise<number>} Resultado de la validación.
 * @throws {BadRequestError} Si hay un error al obtener el token.
 * @throws {NotFoundError} Si el token no se encuentra.
 */
async function validateToken(token: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `SELECT TokenId,UsuarioId,Estado FROM usuarios_token WHERE Token = ? AND estado = "Activo";`;
        pool.query(query, [token], (error, results) => {
            if (error) reject(new BadRequestError("Error getting token"));
            if (results.length === 0) reject(new NotFoundError("Token not found"));
            resolve(results);
        })
    })
}

/**
 * Actualiza el estado de la remisión.
 * @param {string} noremision - Número de la remisión.
 * @param {string} estado - Nuevo estado de la remisión.
 * @returns {Promise<number>} Número de filas afectadas.
 * @throws {BadRequestError} Si hay un error al actualizar el estado.
 */
async function updateState(noremision: string, estado: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `UPDATE remisiones SET estado = ? WHERE no_remision = ?;`;
        pool.query(query, [estado, noremision], (err, result) => {
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
        const query = `UPDATE remisiones SET ingreso_zf = "PERMITIDO" WHERE no_remision = ? AND terminal = ?;`;
        pool.query(query, [terminal, noremision], (err, result) => {
            if (err) reject(new BadRequestError("Error updating allowed"));
            resolve(result.affectedRows);
        })
    })
}