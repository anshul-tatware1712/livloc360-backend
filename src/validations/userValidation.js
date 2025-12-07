import joi from "joi";

export const registerValidation = joi.object({
  firstName: joi.string().max(50).required(),
  lastName: joi.string().max(50).required(),
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(6).required(),
});

export const loginValidation = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().required(),
});

export const deviceLoginValidation = joi.object({
  generatedId: joi.string().required(),
  generatedPassword: joi.string().required(),
});

export const updateUserValidation = joi
  .object({
    firstName: joi.string().max(50),
    lastName: joi.string().max(50),
    email: joi.string().email().lowercase(),
    password: joi.string().min(6),
  })
  .min(1);

export const generateCredentialsValidation = joi.object({});
