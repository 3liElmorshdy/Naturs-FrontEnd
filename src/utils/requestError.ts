import axios from "axios";

export function getRequestErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;

    if (typeof responseMessage === "string") {
      return responseMessage;
    }
  }

  return "Could not update your profile. Please try again.";
}

export function isDuplicateEmailError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  const message = error.response?.data?.message;

  if (status === 409) {
    return true;
  }

  return (
    typeof message === "string" &&
    message.toLowerCase().includes("email") &&
    (
      message.toLowerCase().includes("already") ||
      message.toLowerCase().includes("duplicate") ||
      message.toLowerCase().includes("exist")
    )
  );
}