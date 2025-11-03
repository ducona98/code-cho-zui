import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { redirect, useNavigate } from "react-router";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@components";
import { useCountdown } from "@lib/hooks";
import { ROUTES } from "../../../lib/constants/routes";
import { isAuthenticated, setToken } from "../../../lib/utils/auth";
import {
  commonValidations,
  createValidationSchema,
} from "../../../lib/utils/formValidation";
import type { Route } from "./+types/signin";

// Validation schema for phone number step
const phoneSchema = createValidationSchema({
  phoneNumber: commonValidations.phoneNumber,
});

// Validation schema for OTP step
const otpSchema = createValidationSchema({
  otp: commonValidations.otp,
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: 0.1,
    },
  },
};

export function meta() {
  return [
    { title: "Đăng nhập - Hệ thống cứu trợ thiên tai" },
    {
      name: "description",
      content: "Đăng nhập vào hệ thống cứu trợ lũ lụt và thiên tai",
    },
  ];
}

/**
 * Loader để điều hướng người dùng đã đăng nhập
 * Chuyển về trang chủ nếu người dùng đã được xác thực
 */
export function loader({}: Route.LoaderArgs) {
  if (isAuthenticated()) {
    return redirect(ROUTES.HOME);
  }
  return null;
}

export default function SignIn() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { seconds, start, reset } = useCountdown(60);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Auto focus OTP input when step changes to OTP
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // Xử lý gửi mã OTP
  const handleSendOTP = async (values: { phoneNumber: string }) => {
    try {
      setPhoneNumber(values.phoneNumber);
      // TODO: Gọi API để gửi OTP
      // Example: await sendOTPMutation({ phoneNumber: values.phoneNumber });
      console.log("Đang gửi OTP đến:", values.phoneNumber);

      // Mô phỏng API call cho demo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep("otp");
      start(); // Bắt đầu đếm ngược
    } catch (error) {
      console.error("Gửi OTP thất bại:", error);
    }
  };

  // Xử lý xác thực OTP
  const handleVerifyOTP = async (values: { otp: string }) => {
    try {
      // TODO: Gọi API để xác thực OTP
      // Example: const response = await verifyOTPMutation({ phoneNumber, otp: values.otp });
      console.log("Đang xác thực OTP:", values.otp, "cho số:", phoneNumber);

      // Giả lập API call cho demo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock token - thay thế bằng token thực từ API response
      const mockToken = "mock-jwt-token-" + Date.now();
      setToken(mockToken);
      // Token được lưu vĩnh viễn trong localStorage, chỉ xóa khi người dùng yêu cầu xóa tài khoản hoặc xóa app

      // Giả lập redirect sang trang home sau khi đăng nhập thành công
      // Sử dụng navigate với replace để không lưu lại history của trang signin
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error("Xác thực OTP thất bại:", error);
      throw error;
    }
  };

  // Xử lý gửi lại OTP
  const handleResendOTP = async () => {
    try {
      reset();
      // TODO: Gọi API để gửi lại OTP
      // Example: await sendOTPMutation({ phoneNumber });
      console.log("Đang gửi lại OTP đến:", phoneNumber);

      // Mô phỏng API call cho demo
      await new Promise((resolve) => setTimeout(resolve, 500));

      start(); // Khởi động lại đếm ngược
    } catch (error) {
      console.error("Gửi lại OTP thất bại:", error);
    }
  };

  // Xử lý quay lại bước nhập số điện thoại
  const handleBack = () => {
    setStep("phone");
    reset();
    setPhoneNumber("");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left side - Background with images */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-linear-to-br from-sky-400 via-blue-500 to-blue-600 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900">
        {/* Background images overlay - using multiple images merged */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2070'), url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070')`,
            backgroundBlendMode: "multiply",
            opacity: 0.7,
          }}
        ></div>
        {/* Additional water/wave pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxzycmVYj0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/60 via-blue-800/50 to-transparent"></div>
        {/* Water wave effect */}
        <div className="absolute inset-0 bg-linear-to-t from-blue-600/30 via-transparent to-transparent"></div>
        {/* Content on left side */}
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-4">
              Hệ thống Cứu trợ Thiên tai
            </h1>
            <p className="text-xl mb-2 text-blue-100">Hỗ trợ kịp thời</p>
            <p className="text-lg text-blue-200">
              Kết nối những người cần giúp đỡ với những người sẵn sàng hỗ trợ
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          <motion.div variants={cardVariants}>
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CardTitle className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Hệ thống Cứu trợ Thiên tai
                  </CardTitle>
                </motion.div>
                <CardDescription className="text-base">
                  {step === "phone"
                    ? "Nhập số điện thoại để nhận mã OTP"
                    : `Nhập mã OTP đã gửi đến ${phoneNumber}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === "phone" ? (
                  <Formik
                    key="phone-form"
                    initialValues={{
                      phoneNumber: "",
                    }}
                    enableReinitialize={false}
                    validationSchema={phoneSchema}
                    onSubmit={handleSendOTP}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label htmlFor="phoneNumber">Số điện thoại</Label>
                          <Field
                            as={Input}
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            autoComplete="tel"
                            placeholder="0912345678 hoặc +84912345678"
                            className={`mt-1 ${
                              touched.phoneNumber && errors.phoneNumber
                                ? "border-destructive"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="p"
                            className="text-sm text-destructive mt-1"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Đang gửi OTP..." : "Gửi mã OTP"}
                          </Button>
                        </motion.div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    key="otp-form"
                    initialValues={{
                      otp: "",
                    }}
                    enableReinitialize={false}
                    validationSchema={otpSchema}
                    onSubmit={handleVerifyOTP}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label htmlFor="otp">Mã OTP</Label>
                          <Field
                            innerRef={otpInputRef}
                            as={Input}
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            maxLength={6}
                            placeholder="000000"
                            className={`mt-1 text-center text-2xl tracking-widest ${
                              touched.otp && errors.otp
                                ? "border-destructive"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="otp"
                            component="p"
                            className="text-sm text-destructive mt-1 text-center"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-2"
                        >
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Đang xác thực..." : "Xác thực OTP"}
                          </Button>
                          <div className="flex items-center justify-between text-sm">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={handleBack}
                              className="text-sm"
                            >
                              ← Đổi số điện thoại
                            </Button>
                            {seconds > 0 ? (
                              <span className="text-muted-foreground">
                                Gửi lại sau {seconds}s
                              </span>
                            ) : (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResendOTP}
                                className="text-sm text-primary hover:underline"
                              >
                                Gửi lại OTP
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      </Form>
                    )}
                  </Formik>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
