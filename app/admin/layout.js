'use client';

import { useRouter } from 'next/navigation';
import useUser from '@/hooks/use-user';
import { useEffect } from 'react';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { RotateCw } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.email !== 'keremazimetersoy@gmail.com')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <MaxWidthWrapper>
        <div className="flex items-center justify-center h-screen">
          <RotateCw className="text-orange-500 animate-spin" />
        </div>
      </MaxWidthWrapper>
    );
  }

  if (!user || user.email !== 'keremazimetersoy@gmail.com') {
    return null;
  }

  return (
    <div className="py-10">
      {children}
    </div>
  );
} 