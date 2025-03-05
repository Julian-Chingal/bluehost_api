import {object, string, TypeOf } from 'zod'

export const authSchema = object({
    body: object({
        username: string({
            required_error: 'Username is required'
        }),
        password: string({
            required_error: 'Password is required'
        })
    }).strict()
 })

 export type AuthInput = TypeOf<typeof authSchema>