import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  commonValidations,
  createValidationSchema,
} from "../utils/formValidation";

// Example validation schema using yup
const exampleSchema = createValidationSchema({
  email: commonValidations.email,
  password: commonValidations.password,
  name: commonValidations.required("Name"),
});

// Example form component using Formik + Yup
export function ExampleForm() {
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        name: "",
      }}
      validationSchema={exampleSchema}
      onSubmit={async (values, { setSubmitting }) => {
        // Example: Use axios or RTK Query here
        console.log("Form values:", values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <Field
              id="name"
              name="name"
              type="text"
              className="border rounded px-3 py-2 w-full"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              className="border rounded px-3 py-2 w-full"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              type="password"
              className="border rounded px-3 py-2 w-full"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
