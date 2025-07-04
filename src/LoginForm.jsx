import { useState, useEffect } from "react";

// Email validasyonu için fonksiyon zaten var
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
}

const initialForm = {
  email: "",
  password: "",
  terms: false,
};

const initialErrors = {
  email: false,
  password: false,
  terms: false,
};

const errorMessages = {
  email: "Geçerli bir email adresi yaz",
  password: "Şifre en az 4 karakterden oluşmalı",
};

export default function LoginForm() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [isValid, setIsValid] = useState(false);

  // Field bazında validasyonları yapan fonksiyon
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return !validateEmail(value);
      case "password":
        return value.length < 4;
      case "terms":
        return !value;
      default:
        return false;
    }
  };

  // handleChange güncellenmiş hali
  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    value = type === "checkbox" ? checked : value;

    // formData güncelle
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ilgili error kontrolü ve güncellemesi
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // Tüm validasyonlar doğru mu diye kontrol eden useEffect
  useEffect(() => {
    const formIsValid =
      validateEmail(formData.email) &&
      formData.password.length >= 4 &&
      formData.terms;
    setIsValid(formIsValid);
  }, [formData]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;
    // Normalde gönderme işlemi burada olur
    console.log(formData);
  }

  return (
    <div className="form">
      <h1>Kayıt ol</h1>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <label
          className={`form-input-line${errors.email ? " hasError" : ""}`}
          data-testid="email-label"
        >
          <span className="form-label">Email</span>
          <input
            className="form-input"
            name="email"
            onChange={handleChange}
            value={formData.email}
            data-testid="email"
            type="text"
          />
          {/* Hata varsa mesajı göster */}
          {errors.email && (
            <span className="error-message" role="email-error">
              {errorMessages.email}
            </span>
          )}
        </label>

        {/* Password */}
        <label
          data-testid="password-label"
          className={`form-input-line${errors.password ? " hasError" : ""}`}
        >
          <span className="form-label">Şifre</span>
          <input
            className="form-input"
            name="password"
            onChange={handleChange}
            value={formData.password}
            data-testid="password"
            type="text"
          />
          {errors.password && (
            <span className="error-message" role="password-error">
              {errorMessages.password}
            </span>
          )}
        </label>

        {/* Terms */}
        <label
          className={`form-ch-line${errors.terms ? " hasError" : ""}`}
          data-testid="terms-label"
        >
          <input
            type="checkbox"
            name="terms"
            data-testid="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          <span className="ch-label">
            Kullanım koşullarını kabul ediyorum.
          </span>
        </label>

        {/* Hata mesajı istenmiyor, çünkü checkbox için mesaj belirtilmemiş */}

        {/* Gönder butonu, valid değilse disabled */}
        <button
          className="send-button"
          data-testid="send"
          disabled={!isValid}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
