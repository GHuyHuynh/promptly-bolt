import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white dark:bg-gray-800 shadow-xl border dark:border-gray-700",
              headerTitle: "text-gray-900 dark:text-white",
              headerSubtitle: "text-gray-600 dark:text-gray-300",
              socialButtonsBlockButton: "dark:bg-gray-700 dark:hover:bg-gray-600",
              formFieldLabel: "text-gray-700 dark:text-gray-300",
              formFieldInput: "dark:bg-gray-700 dark:border-gray-600",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              footerActionLink: "text-blue-600 hover:text-blue-700",
              identityPreviewText: "text-gray-700 dark:text-gray-300",
              identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}