interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return <p className="text-sm text-red-600 mt-1">{message}</p>;
};
