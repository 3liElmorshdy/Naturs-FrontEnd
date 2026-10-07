import { useVerifyEmail } from "../../hooks/auth/useVerifyEmail";

const VerifyEmail = () => {
  const { status, errorMessage } = useVerifyEmail();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {status === "loading" && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            Verifying your account... 
          </h2>
        </div>
      )}

      {status === "success" && (
        <div className="text-center text-green-600">
          <h2 className="text-2xl font-bold mb-4">Your email has been verified successfully 🎉</h2>
          <p>You can now log in to your account.</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">error happened</h2>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
