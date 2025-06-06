import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200",
                card: "bg-transparent shadow-none",
                headerTitle: "text-gray-900 dark:text-white font-bold",
                headerSubtitle: "text-gray-600 dark:text-gray-400",
                socialButtonsBlockButton:
                  "border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors rounded-lg",
                formFieldInput:
                  "border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800",
                footerActionLink:
                  "text-blue-600 hover:text-blue-700 font-medium",
              },
            }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}