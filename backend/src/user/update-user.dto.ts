import z from "zod";

export const updateUserDto = z.object({
    name: z.string().min(2, ("Minimum 2 characters")).max(32, ("Maximum 32 characters")).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8, ("Minimum 8 characters")).max(32, ("Maximum 32 characters")).optional()
})

export type UpdateUserDto = z.infer<typeof updateUserDto>