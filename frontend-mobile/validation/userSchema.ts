import { z } from "zod";

// Custom schema
const phoneSchema = z.string().regex(/^(\+41|0)[1-9](\d{2}){4}$/, {
  message: "Numéro de téléphone invalide",
});

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au minimum 8 caractères")
  .nonempty("Le mot de passe ne peut pas être vide")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule");

export const registerSchema = z.object({
  firstname: z.string().nonempty("Le prénom ne peut pas être vide"),
  phoneNumber: phoneSchema,
  email: z.string().email("L'adresse mail fournie n'est pas valide").nonempty("L'adresse mail ne peut pas être vide"),
  password: passwordSchema,
});
