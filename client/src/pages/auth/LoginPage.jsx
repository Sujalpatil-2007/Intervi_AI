import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-2 text-center text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-slate-500">
          Sign in to continue to InterviAI
        </p>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;