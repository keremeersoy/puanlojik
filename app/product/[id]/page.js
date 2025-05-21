'use client';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Comments } from '@/services/Comments';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Products } from '@/services/Products';
import { RotateCw, Sparkles, Brain } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const ProductIdPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Products.getProductById(id).then((productData) => {
      setProduct(productData);
      if (productData) {
        Comments.getCommentsByProductId(id)
          .then((commentsData) => {
            setComments(commentsData);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error("Error fetching product:", error);
      setLoading(false);
    });
  }, [id]);

  const calculateAverageScore = () => {
    if (!product || !product.commentCount || product.commentCount === 0) {
      return 0;
    }
    return (product.totalScore / product.commentCount);
  };

  if (loading) {
    return (
      <MaxWidthWrapper>
        <div className="flex items-center justify-center h-screen">
          <RotateCw className="text-orange-500 animate-spin" />
        </div>
      </MaxWidthWrapper>
    );
  }

  if (!product) {
    return (
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Ürün Bulunamadı</h1>
          <p className="text-muted-foreground">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Button asChild className="mt-4" variant="orange">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="py-8">
      <div className="flex flex-col space-y-8 w-full">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">{product.name}</CardTitle>
              {product.commentCount > 0 && (
                <div className="flex items-center space-x-2 text-lg bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg">
                  <Sparkles className="h-6 w-6" />
                  <span className="font-semibold">Ort. Puan: {calculateAverageScore().toFixed(1)}/100</span>
                  <span className="text-sm font-normal">({product.commentCount} yorum)</span>
                </div>
              )}
            </div>
            {product.createdAtFormatted && (
                <CardDescription className="pt-2">Eklendiği Tarih: {product.createdAtFormatted}</CardDescription>
            )}
          </CardHeader>
        </Card>

        {product.aiSummary && (
          <Card className="w-full shadow-md bg-gradient-to-r from-orange-50 via-amber-50 to-pink-50 dark:from-orange-900/30 dark:via-amber-900/30 dark:to-pink-900/30 border-orange-200 dark:border-orange-700">
            <CardHeader>
              <div className="flex items-center">
                <Brain className="h-8 w-8 mr-3 text-orange-500 dark:text-orange-400" />
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-400 dark:to-pink-400">
                  Yapay Zeka Değerlendirmesi
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {product.aiSummary}
              </p>
              {product.aiSummaryUpdatedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-orange-200 dark:border-orange-700/50">
                  Son güncelleme: {format(new Date(product.aiSummaryUpdatedAt.seconds * 1000 + product.aiSummaryUpdatedAt.nanoseconds / 1000000), 'dd/MM/yyyy HH:mm')}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kullanıcı Yorumları ({comments.length})</h2>
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id} className="w-full shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">{comment.title}</CardTitle>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg text-orange-500 dark:text-orange-400 p-1 px-3 bg-orange-100 dark:bg-orange-900/70 rounded-md">
                          {comment.score}/100
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{comment.createdAtFormatted}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Bu ürün için henüz yorum yapılmamış.</p>
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductIdPage;
