'use client';
import CategoriesArea from '@/components/categories-area';
import LatestComments from '@/components/latest-comments';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/use-user';
import { RotateCw, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <MaxWidthWrapper className="py-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
          <RotateCw className="w-8 h-8 text-gray-500 animate-spin mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="py-8 space-y-12">
      {user ? (
        <section className="w-full p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Hoş geldin, {user.displayName || user.email}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Deneyimlerini bizimle paylaşmaya ne dersin?
              </p>
            </div>
            <Button 
              asChild 
              variant="default"
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 dark:text-white dark:bg-orange-600 dark:hover:bg-orange-700 flex-shrink-0"
            >
              <Link href="/create-comment" className="flex items-center">
                <MessageSquarePlus className="w-5 h-5 mr-2" />
                Hemen Yorum Yap
              </Link>
            </Button>
          </div>
        </section>
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
