export const extractAxiosErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;
    return Array.isArray(message) ? message[0] || "Une erreur est survenue" : message || "Une erreur est survenue";
  }

  return "Une erreur est survenue";
};
