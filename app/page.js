'use client';
import CategoriesArea from '@/components/categories-area';
import LatestComments from '@/components/latest-comments';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/use-user';
import { db } from '@/lib/firebase';
import { Comments } from '@/services/Comments';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { RotateCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <MaxWidthWrapper>
        <div className="flex items-center justify-center h-screen">
          <RotateCw className="text-orange-500 animate-spin" />
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="space-y-12 items-start justify-start">
      {user ? (
        <div className="flex items-center justify-end w-full">
          <Button asChild variant="success">
            <Link href="/create-comment">Yorum Yap</Link>
          </Button>
        </div>
      ) : (
        <div>
          <h1 className="px-12 text-center text-8xl font-bold tracking-wide">
            doğru puan, doğru yorum.{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              puanlojik{' '}
            </span>
            'le keşfet !
          </h1>
          <div className="w-full flex items-center justify-center mt-24">
            <Button asChild>
              <Link href="/auth/register">Şimdi Başlayın</Link>
            </Button>
          </div>
        </div>
      )}
      <CategoriesArea />
      <LatestComments />
    </MaxWidthWrapper>
  );
}
