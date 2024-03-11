import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
// import EmailProvider from 'next-auth/providers/email'

const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',');


export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
adapter:MongoDBAdapter(clientPromise),
callbacks: {
  session: ({session,token,user}) => {
    if (adminEmails.includes( session?.user?.email)) {
      return session;
    } else {
      return false;
    }
  },
},
})