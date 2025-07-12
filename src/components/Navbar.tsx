
import { useRouter } from "next/navigation";

export default function Navbar() {

    const router = useRouter();

  return <>
  <header className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">StackIt</h1>
                <span className="ml-2 text-sm text-gray-400">Task Management</span>
              </div>
              <button onClick={() => router.push('/auth/signin')} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                Login
              </button>
            </div>
          </div>
        </header>
  </>
}
    