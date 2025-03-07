import {object, string, TypeOf } from 'zod'

export const authSchema = object({
    body: object({
        username: string({
            required_error: 'Username is required'
        }).min(3, 'Username must be at least 3 characters long'),
        password: string({
            required_error: 'Password is required'
        }).min(6, 'Password must be at least 6 characters long')
    }).strict()
 })

 export type AuthInput = TypeOf<typeof authSchema>