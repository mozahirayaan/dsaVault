"use client";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";


export default function Home() {
  // For simple fade-in animation on load
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const { data: session ,status} = useSession();



  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      router.push("/Dashboard");
    }
    setLoaded(true);
  }, [status]);

  
  
  if (status === "loading") {return <>Loading....</> }

  
  



  const platforms = [
    {
      name: "LeetCode",
      logo: "/logos/leetcode.png", // Place logo in public/logos
      link: "https://leetcode.com",
    },
    {
      name: "Codeforces",
      logo: "/logos/codeforces.png",
      link: "https://codeforces.com",
    },
    {
      name: "CodeChef",
      logo: "/logos/codechef.png",
      link: "https://www.codechef.com",
    },
    {
      name: "GeeksforGeeks",
      logo: "/logos/gfg.png",
      link: "https://www.geeksforgeeks.org",
    },
  ];



  

  return (<>
    <Navbar />
   
    <div className="relative min-h-screen bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-700 overflow-hidden flex flex-col">
      {/* Floating blobs */}
      <FloatingBlobs />

      {/* Header */}
      <header
        className={`max-w-5xl mt-16 mx-auto px-6 pt-16 text-center text-white select-none transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 drop-shadow-lg">
          dsaVault
        </h1>
        <p className="text-xl max-w-3xl mx-auto drop-shadow-md">
          Your ultimate coding companion — save, organize, and track DSA problems seamlessly.
        </p>
      </header>

      {/* Main card */}
      <main
        className={`flex-grow flex items-center justify-center px-6 mt-12 max-w-3xl mx-auto w-full transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl p-12 w-full max-w-md text-center border border-white border-opacity-30 hover:shadow-2xl transition-shadow duration-500">
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-md">
            Sign in with
          </h2>
          <button
            type="button"
            onClick={() => signIn("google")}
            className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:via-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-2xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            <GoogleIcon className="w-7 h-7 group-hover:brightness-110 transition" />
            <span className="text-lg">Sign in with Google</span>
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section
        className={`py-16 px-6 max-w-6xl mx-auto text-white select-none transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <h3 className="text-4xl font-bold mb-12 text-center drop-shadow-lg">
          Why choose <span className="text-pink-400">dsaVault?</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            title="Save Problems"
            description="Capture problems from Codeforces, LeetCode, and GFG effortlessly."
            icon={
              <svg
                className="w-14 h-14 mx-auto mb-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            }
          />
          <FeatureCard
            title="Track Progress"
            description="Stay motivated with stats, streaks, and personalized insights."
            icon={
              <svg
                className="w-14 h-14 mx-auto mb-5 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <FeatureCard
            title="Organize Learning"
            description="Create tags, add notes, and build your perfect DSA roadmap."
            icon={
              <svg
                className="w-14 h-14 mx-auto mb-5 text-pink-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="8" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Platforms Section */}
      <section id="supported" className="py-16 bg-white bg-opacity-5 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-10">
          Supported Platforms
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 place-items-center">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition hover:scale-110 hover:drop-shadow-lg rounded-lg bg-white bg-opacity-10 backdrop-blur-md p-4 flex flex-col items-center text-center hover:bg-opacity-20 select-none"
            >
              <Image
                src={platform.logo}
                alt={platform.name}
                width={80}
                height={80}
                className="rounded-xl"
              />
              <p className="text-white mt-2 font-medium">{platform.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="py-6 text-center text-white text-sm bg-indigo-900 bg-opacity-70 select-none">
        &copy;  dsaVault. All rights reserved.
      </footer>
    </div>

    </>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-400 cursor-default select-text">
      <div>{icon}</div>
      <h4 className="text-2xl font-semibold mb-3">{title}</h4>
      <p className="text-white text-opacity-85">{description}</p>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={props.className}
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.282a9.002 9.002 0 01-3.86 5.59v4.657h6.243C40.29 35.478 43.61 28.48 43.611 20.083z"
      />
      <path
        fill="#FF3D00"
        d="M24 44c5.4 0 9.94-1.785 13.253-4.83l-6.243-4.657c-1.73 1.17-3.945 1.855-7.01 1.855-5.393 0-9.96-3.64-11.607-8.54H5.013v5.366A19.993 19.993 0 0024 44z"
      />
      <path
        fill="#4CAF50"
        d="M12.393 26.83a11.94 11.94 0 010-7.66V13.8H5.013a19.99 19.99 0 000 20.4l7.38-5.37z"
      />
      <path
        fill="#1976D2"
        d="M24 12.11c2.943 0 4.96 1.273 6.11 2.33l4.57-4.57C33.926 7.75 29.376 6 24 6a19.99 19.99 0 00-18.987 12.8l7.38 5.37c1.62-4.9 6.21-8.06 11.607-8.06z"
      />
    </svg>
  );
}

function FloatingBlobs() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute top-[-150px] left-[-150px] w-72 h-72 rounded-full bg-pink-500 opacity-40 blur-3xl animate-blob"
      />
      <div
        aria-hidden="true"
        className="absolute top-[200px] right-[-100px] w-96 h-96 rounded-full bg-indigo-500 opacity-30 blur-3xl animate-blob animation-delay-2000"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-120px] left-1/2 w-80 h-80 rounded-full bg-purple-600 opacity-40 blur-3xl animate-blob animation-delay-4000"
        style={{ transform: "translateX(-50%)" }}
      />
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -10px) scale(1.1);
          }
          66% {
            transform: translate(-15px, 15px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
