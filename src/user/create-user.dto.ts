import z from "zod";

export const createUserDto = z.object({
    name: z.string().min(2, ("Minimum 2 characters")).max(32, ("Maximum 32 characters")),
    email: z.string().email(),
    password: z.string().min(8, ("Minimum 8 characters")).max(32, ("Maximum 32 characters"))
    
})

export type CreateUserDto = z.infer<typeof createUserDto>