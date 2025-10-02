const { z } = require('zod');

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const weatherQuerySchema = z.object({
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().toUpperCase().length(2)
});

module.exports = { loginSchema, weatherQuerySchema };