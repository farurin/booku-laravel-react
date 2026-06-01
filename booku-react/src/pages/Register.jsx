import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import AuthLayout, {
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconFacebook,
} from "../components/AuthLayout";
import { validateRegister } from "../utils/validation";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { registerUser } from "../services/api";

const Register = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateRegister(email, password, t);
    if (!validation.isValid) {
      setIsError(true);
      setErrorMessage(validation.errors.email || validation.errors.password);
      return;
    }

    try {
      const data = await registerUser({ email, password });
      setIsError(false);
      setErrorMessage("");
      login(data.token, data.user);
      navigate("/");
    } catch (error) {
      setIsError(true);
      setErrorMessage(`*${error.message}`);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
          {t("auth_reg_title")}
        </h1>
        <p className="text-gray-500 mt-3 text-sm font-medium">
          {t("auth_reg_desc")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="email"
              value={t("auth_email_label")}
              className="font-black text-gray-700 tracking-wide"
            />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder={t("auth_email_ph")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color={
              isError && errorMessage.includes("Email") ? "failure" : "gray"
            }
            className="[&_input]:rounded-2xl [&_input]:py-3 [&_input]:border-2 [&_input]:border-gray-100 focus:[&_input]:border-booku-cyan focus:[&_input]:ring-booku-cyan font-bold"
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="password"
              value={t("auth_pass_label")}
              className="font-black text-gray-700 tracking-wide"
            />
          </div>
          <div className="relative">
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth_pass_ph")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color={
                isError && errorMessage.includes("Password")
                  ? "failure"
                  : "gray"
              }
              className="[&_input]:rounded-2xl [&_input]:py-3 [&_input]:pr-12 [&_input]:border-2 [&_input]:border-gray-100 focus:[&_input]:border-booku-cyan focus:[&_input]:ring-booku-cyan font-bold"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center mt-0 text-gray-400 hover:text-booku-cyan transition-colors"
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {isError && (
            <p className="text-xs text-red-500 mt-2 ml-1 font-bold leading-relaxed">
              {errorMessage}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-booku-coral enabled:hover:bg-orange-500 rounded-2xl py-1 mt-4 border-none shadow-md font-black transition-all hover:-translate-y-1"
        >
          {t("auth_btn_reg")}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-0.5 bg-gray-100 rounded-full"></div>
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
          {t("auth_or_reg")}
        </p>
        <div className="flex-1 h-0.5 bg-gray-100 rounded-full"></div>
      </div>

      <div className="flex items-center gap-4">
        {/* Tombol dengan Hover Info */}
        <div className="relative flex-1 group">
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-gray-100 rounded-2xl bg-gray-50 transition shadow-sm opacity-60 cursor-not-allowed"
          >
            <IconGoogle />
            <span className="text-sm text-gray-700 font-black">Google</span>
          </button>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
            Segera Hadir
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>

        <div className="relative flex-1 group">
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1877F2]/60 rounded-2xl transition shadow-sm opacity-60 cursor-not-allowed"
          >
            <IconFacebook />
            <span className="text-sm text-white font-black">Facebook</span>
          </button>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
            Segera Hadir
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm">
        <p className="text-gray-500 font-bold">
          {t("auth_has_account")}{" "}
          <NavLink
            to="/login"
            className="text-booku-cyan font-black hover:text-teal-600 hover:underline transition-colors"
          >
            {t("auth_link_login")}
          </NavLink>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
