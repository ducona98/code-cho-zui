import * as Yup from "yup";

// Phone number validation regex for Vietnamese phone numbers
// Supports: 10 digits starting with 0, or +84 followed by 9 digits
const phoneRegex = /^(0|\+84)[35789][0-9]{8}$/;

// Common validation schemas
export const commonValidations = {
  email: Yup.string()
    .email("Định dạng email không hợp lệ")
    .required("Email là bắt buộc"),
  phoneNumber: Yup.string()
    .matches(phoneRegex, "Định dạng số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc")
    .test(
      "phone-length",
      "Số điện thoại phải có 10 chữ số (bắt đầu bằng 0) hoặc 12 chữ số (bắt đầu bằng +84)",
      (value) => {
        if (!value) return false;
        // Remove spaces and dashes for validation
        const cleaned = value.replace(/[\s-]/g, "");
        return cleaned.length === 10 || cleaned.length === 12;
      }
    ),
  otp: Yup.string()
    .length(6, "Mã OTP phải có 6 chữ số")
    .matches(/^[0-9]{6}$/, "Mã OTP chỉ được chứa số")
    .required("Mã OTP là bắt buộc"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Mật khẩu là bắt buộc"),
  required: (fieldName: string) =>
    Yup.string().required(`${fieldName} là bắt buộc`),
  minLength: (fieldName: string, length: number) =>
    Yup.string().min(length, `${fieldName} phải có ít nhất ${length} ký tự`),
  maxLength: (fieldName: string, length: number) =>
    Yup.string().max(length, `${fieldName} tối đa ${length} ký tự`),
  number: (fieldName: string) =>
    Yup.number().typeError(`${fieldName} phải là số`),
};

// Helper function to create validation schema
export const createValidationSchema = (
  schema: Record<string, Yup.AnySchema>
) => {
  return Yup.object().shape(schema);
};
