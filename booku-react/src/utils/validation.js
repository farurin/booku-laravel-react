// Validasi ketat khusus untuk halaman Register
export const validateRegister = (email, password, t) => {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Regex Password: Min 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!email) {
    errors.email = t("val_email_empty");
  } else if (!emailRegex.test(email)) {
    errors.email = t("val_email_invalid");
  }

  if (!password) {
    errors.password = t("val_pass_empty");
  } else if (!passwordRegex.test(password)) {
    errors.password = t("val_pass_regex");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validasi standar khusus untuk halaman Login (agar akun lama tidak terkunci)
export const validateLogin = (email, password, t) => {
  const errors = {};

  if (!email) {
    errors.email = t("val_email_empty");
  }
  if (!password) {
    errors.password = t("val_pass_empty");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
