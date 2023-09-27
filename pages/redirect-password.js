import Link from "next/link";

export default function Redirect() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg p-8 shadow-md">
        <>
          <h1 className="text-2xl font-bold mb-4">Link sent</h1>
          <p>Please check your mailbox to reset your password</p>
          <p>A link has been sent to your inbox</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-8">
            <Link href={"/authentification/login"} className="uppercase">
              Login
            </Link>
          </button>
        </>
      </div>
    </div>
  );
}
