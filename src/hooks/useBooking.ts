/**
 * Hook useBooking - FinFlow Capital
 * Encapsula o estado, validações e submissão do formulário de agendamento de consultoria.
 */
import { useState, type FormEvent } from "react";
import {
  createBooking,
  type Period,
  type InvestorProfile,
} from "@/services/bookingService";

export type FormState = {
  fullName: string;
  email: string;
  phone: string;
  objective: string;
  investorProfile: InvestorProfile;
  preferredDate: string;
  preferredPeriod: Period | "";
};

export type FormErrors = Partial<Record<keyof FormState, string>>;
export type SubmitStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  objective: "",
  investorProfile: "",
  preferredDate: "",
  preferredPeriod: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+()\-\s\d]{8,30}$/;

export function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.fullName.trim().length < 2) {
    errors.fullName = "Informe seu nome completo.";
  }
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!PHONE_PATTERN.test(form.phone.trim())) {
    errors.phone = "Informe um telefone com DDD.";
  }
  if (form.objective.trim().length < 5) {
    errors.objective = "Descreva seu objetivo em pelo menos 5 caracteres.";
  }
  if (!form.preferredDate || form.preferredDate < todayIsoDate()) {
    errors.preferredDate = "Escolha uma data a partir de hoje.";
  }
  if (!form.preferredPeriod) {
    errors.preferredPeriod = "Escolha um período.";
  }
  return errors;
}

export function useBooking() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await createBooking({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        objective: form.objective.trim(),
        preferred_date: form.preferredDate,
        preferred_period: form.preferredPeriod as Period,
        investor_profile: form.investorProfile || null,
      });

      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar sua solicitação agora. Verifique os dados e tente novamente."
      );
    }
  }

  function resetForm() {
    setStatus("idle");
    setForm(EMPTY_FORM);
    setErrors({});
    setErrorMessage(null);
  }

  return {
    form,
    errors,
    status,
    errorMessage,
    updateField,
    handleSubmit,
    resetForm,
  };
}

