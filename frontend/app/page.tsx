import LoginForm from "@/components/login-form"

export default function Home() {
  // In a real application, we would check if the user is authenticated
  // If authenticated, redirect to dashboard
  // For demo purposes, we'll just show the login form

  // const isAuthenticated = false;
  // if (isAuthenticated) {
  //   redirect("/dashboard");
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#4285f4]">レセプト理由書アシスタント</h1>
          <p className="mt-2 text-gray-600">効率的にレセプト理由書を作成するためのアシスタントツール</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
