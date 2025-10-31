import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { Link } from "react-router";
import * as Yup from "yup";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  commonValidations,
  createValidationSchema,
} from "../../lib/utils/formValidation";

// Validation schema
const signUpSchema = createValidationSchema({
  name: commonValidations.required("Name"),
  email: commonValidations.email,
  password: commonValidations.password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
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
    { title: "Sign Up" },
    { name: "description", content: "Create a new account" },
  ];
}

export default function SignUp() {
  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // Handle sign up logic here
    console.log("Sign up:", values);
    // Example: await signUpMutation({ name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={cardVariants}>
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CardTitle className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
              </motion.div>
              <CardDescription className="text-base">
                Enter your information to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={signUpSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="name">Full Name</Label>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className={`mt-1 ${
                          touched.name && errors.name
                            ? "border-destructive"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="text-sm text-destructive mt-1"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`mt-1 ${
                          touched.email && errors.email
                            ? "border-destructive"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-sm text-destructive mt-1"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="password">Password</Label>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        className={`mt-1 ${
                          touched.password && errors.password
                            ? "border-destructive"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="text-sm text-destructive mt-1"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className={`mt-1 ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "border-destructive"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="confirmPassword"
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
                        {isSubmitting ? "Creating account..." : "Sign Up"}
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center text-sm"
                    >
                      <span className="text-muted-foreground">
                        Already have an account?{" "}
                      </span>
                      <Link
                        to="/signin"
                        className="text-primary font-medium hover:underline transition-colors"
                      >
                        Sign in
                      </Link>
                    </motion.div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
