import * as Yup from "yup";

// Common validation schemas
export const commonValidations = {
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  required: (fieldName: string) =>
    Yup.string().required(`${fieldName} is required`),
  minLength: (fieldName: string, length: number) =>
    Yup.string().min(
      length,
      `${fieldName} must be at least ${length} characters`
    ),
  maxLength: (fieldName: string, length: number) =>
    Yup.string().max(
      length,
      `${fieldName} must be at most ${length} characters`
    ),
  number: (fieldName: string) =>
    Yup.number().typeError(`${fieldName} must be a number`),
};

// Helper function to create validation schema
export const createValidationSchema = (
  schema: Record<string, Yup.AnySchema>
) => {
  return Yup.object().shape(schema);
};
