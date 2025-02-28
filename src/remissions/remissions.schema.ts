import { object, string, TypeOf } from "zod";


export const updateRemissionSchema = object({
    body: object({
        estado: string().optional(),
        terminal: string().optional(),
        usuario: string().optional(),
        nombre: string().optional(),
        token: string({
            required_error: 'Token is required'
        }), 
        noremision: string({
            required_error: 'Remission number is required'
        }),
    })
})

export type UpdateRemissionInput = TypeOf<typeof updateRemissionSchema>;