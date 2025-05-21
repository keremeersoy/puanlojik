'use client';
import { Comments } from '@/services/Comments';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MessageCircle, Tag, ArrowRightCircle, CalendarDays, ThumbsUp, Sparkles } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LatestComments = () => {
  const [latestComments, setLatestComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Comments.getLatestComments(6)
      .then((comments) => {
        setLatestComments(comments || []);
      })
      .catch((error) => {
        console.error('Error fetching latest comments:', error);
        setLatestComments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 w-full">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="overflow-hidden shadow-sm p-1">
            <CardHeader className="pb-2 pt-4 px-4">
              <Skeleton className="h-7 w-3/4 rounded-md mb-2.5" /> 
              <Skeleton className="h-5 w-full rounded-md mb-1.5" /> 
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-2 space-y-2.5">
              <Skeleton className="h-6 w-1/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-4/6 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (latestComments.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Son Yorumlar</h1>
        <Sparkles className="mx-auto h-16 w-16 text-orange-400 dark:text-orange-500 opacity-70" />
        <p className="mt-5 text-xl font-semibold text-gray-700 dark:text-gray-200">Henüz Yorum Yok</p>
        <p className="mt-2 text-md text-gray-500 dark:text-gray-400">Görünüşe göre bu alanda henüz bir hareketlilik olmamış.</p>
        <Button asChild variant="default" size="lg" className="mt-6 bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700">
          <Link href="/create-comment">İlk Yorumu Sen Yap <ArrowRightCircle className="ml-2 h-5 w-5"/></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='w-full pt-8'>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Son Yorumlar</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 w-full">
      {latestComments.map((comment) => (
        <Card 
          key={comment.id} 
          className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transform hover:-translate-y-1"
        >
          <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-700/60">
            <div className="flex items-start justify-between gap-3 mb-2">
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                {comment.title}
              </CardTitle>
              <Badge 
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5 text-base font-bold bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 border-orange-300 dark:border-orange-700 whitespace-nowrap"
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{comment.score}</span>
                <span className="text-xs font-medium opacity-80">/100</span>
              </Badge>
            </div>
            
            {comment.productName && (
              <Link href={`/product/${comment.productId}`} className="group inline-block mb-1.5">
                <div className="flex items-center text-sm md:text-md font-medium text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                  <Tag className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 opacity-80" />
                  <span className="group-hover:underline decoration-orange-500 underline-offset-2">{comment.productName}</span>
                </div>
              </Link>
            )}
            <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <CalendarDays className="h-4 w-4 mr-1.5 opacity-80" />
              <span>{comment.createdAtFormatted}</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 flex-grow">
            <p className="text-md md:text-lg text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
              {comment.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
    </div>

  );
};

export default LatestComments;
