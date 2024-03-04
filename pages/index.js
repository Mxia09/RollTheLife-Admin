// import Layout from "@/components/Layout";
// import { useSession } from "next-auth/react";


// export default function Home() {
//   const {data : session} = useSession();
//     return (
//       <Layout>
//         <div className="text-blue-900 flex justify-between">
//           <h2>
//             Hello, <b>{session?.user?.name}</b>
//           </h2>
//           <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
//             <img src={session?.user?.image} alt="" className="w-6 h-6"/>
//             <span className="px-2">
//               {session?.user?.name}
//             </span>
//           </div>
//         </div>
//       </Layout>
//     );
//     }
import { useSession, signIn, signOut } from "next-auth/react"


export default function home () {
  const { data: session } = useSession();
  if (!session) {
    return(
      <div className="bg-blue-900 w-screen h-screen flex items-cent">
      <div className="text-center w-full">
        <button onClick={() => signIn()} className="bg-blue-900 px-4 rounded-lg">login</button>
      </div>
    </div>
    )
  }

  return (
    <div className="bg-red-900 w-screen h-screen flex">
      logged in as {session.user.email}
    </div>
  );
}