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
import ActionPopupModal from "../components/ActionPopupModal";
import popupFavImg from "../assets/popups/popup-fav.png";

const Register = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
          {t("auth_reg_title")}
        </h1>
        <p className="text-gray-500 mt-2 text-sm">{t("auth_reg_desc")}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="email"
              value={t("auth_email_label")}
              className="font-bold text-gray-700"
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
            className="[&_input]:rounded-xl [&_input]:border-gray-200 focus:[&_input]:border-teal-400 focus:[&_input]:ring-teal-400"
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="password"
              value={t("auth_pass_label")}
              className="font-bold text-gray-700"
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
              className="[&_input]:rounded-xl [&_input]:pr-12 [&_input]:border-gray-200 focus:[&_input]:border-teal-400 focus:[&_input]:ring-teal-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center mt-0 text-gray-400 hover:text-teal-600 transition-colors"
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {isError && (
            <p className="text-xs text-red-500 mt-2 ml-1 font-medium leading-relaxed">
              {errorMessage}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 enabled:hover:bg-orange-600 rounded-xl mt-4 border-none shadow-md font-bold transition-all"
        >
          {t("auth_btn_reg")}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gray-200"></div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          {t("auth_or_reg")}
        </p>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm font-bold text-sm text-gray-700"
        >
          <IconGoogle /> Google
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1877F2] rounded-xl hover:bg-blue-600 transition shadow-sm font-bold text-sm text-white"
        >
          <IconFacebook /> Facebook
        </button>
      </div>

      <div className="mt-10 text-center text-sm">
        <p className="text-gray-500 font-medium">
          {t("auth_has_account")}{" "}
          <NavLink
            to="/login"
            className="text-teal-600 font-extrabold hover:text-teal-700 hover:underline transition-colors"
          >
            {t("auth_link_login")}
          </NavLink>
        </p>
      </div>

      <ActionPopupModal
        isOpen={isModalOpen}
        image={popupFavImg}
        title={t("auth_popup_dev_title")}
        description={t("auth_popup_dev_desc")}
        primaryBtnText={t("auth_btn_ok")}
        primaryBtnColor="bg-orange-500 hover:bg-orange-600 text-white"
        secondaryBtnText={t("auth_btn_close")}
        onPrimaryClick={() => setIsModalOpen(false)}
        onSecondaryClick={() => setIsModalOpen(false)}
      />
    </AuthLayout>
  );
};

export default Register;
