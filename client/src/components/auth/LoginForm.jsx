import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useLogin } from "../../hooks/mutations/useLogin";
import { useAuth } from "../../hooks/useAuth";

import Button from "../ui/Button";
import Input from "../ui/Input";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const { refreshUser } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useLogin();

  const onSubmit = async (formData) => {
    try {
      await loginMutation.mutateAsync(formData);

      await refreshUser();

      toast.success("Login successful.");

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid email or password.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email}
        {...register("email", {
          required: "Email is required",
        })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password}
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters",
          },
        })}
      />

      <Button type="submit" loading={loginMutation.isPending}>
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
