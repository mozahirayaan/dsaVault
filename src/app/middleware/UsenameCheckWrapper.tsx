// components/UserCheckWrapper.tsx
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UsernameCheckWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (status === 'loading') return;
      
      if (!session || !session.user) {
        router.push('/');
      } else {
        // Optionally, you can fetch user details here if needed
        try {
          const response = await axios.get('/api/getUserDetail');
          if (!response.data || !response.data.userDetails) {
            return ;
          }
          if(!response.data.userDetails.leetcode||!response.data.userDetails.codeforces) {
            router.push('/userInfo'); // Redirect to setup if no user details
            console.log('User details:', response.data.userDetails);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          router.push('/'); // Redirect on error
        }
      }
    };

    checkUser();
  },[status])

  return <>{children}</>;
}
