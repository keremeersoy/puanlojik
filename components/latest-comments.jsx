'use client';
import { Comments } from '@/services/Comments';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const LatestComments = () => {
  const [latestComments, setLatestComments] = useState([]);

  useEffect(() => {
    Comments.getLatestComments(6)
      .then((comments) => {
        setLatestComments(comments);
      })
      .catch((error) => {
        console.log('fetchedComments', error);
      });
  }, []);

  return (
    <div className="w-full h-full">
      {console.log('latestComments', latestComments)}
      <h1 className="text-xl font-bold mb-4">Son Yorumlar</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {latestComments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <CardTitle className="flex flex-col space-y-4">
                <div className="flex items-center justify-between space-x-4">
                  <p className="text-orange-500 p-2 bg-orange-100 rounded-full">{comment.score}</p>
                  <p className="text-sm font-normal">{comment.createdAtFormatted}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <h1 className="text-lg font-semibold">{comment.title}</h1>

              <p>{comment.content.length > 75 ? `${comment.content.substring(0, 75)}...` : comment.content}</p>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <h1>Ürün :</h1>

                <Link href={`/product/${comment.productId}`}>{comment.productName}</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LatestComments;
