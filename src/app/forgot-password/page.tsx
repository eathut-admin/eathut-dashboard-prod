import { ForgotPasswordPageComp } from "@/components/forgot-password-components/forgot-password-page";

const ForgotPassword = () => {
  return (
    <div>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-md">
          <ForgotPasswordPageComp />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
