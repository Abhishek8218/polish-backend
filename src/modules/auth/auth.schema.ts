import z from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 2 characters long."),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});
export type TLoginInput = z.infer<typeof loginSchema>;



export const refreshAccessTokenSchema = z.object({
    refreshToken : z.string()
})

export type TRefreshAccessTokenInput = z.infer<typeof refreshAccessTokenSchema>