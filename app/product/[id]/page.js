'use client';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Comments } from '@/services/Comments';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Products } from '@/services/Products';
import { RotateCw } from 'lucide-react';
import Link from 'next/link';

const ProductIdPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Products.getProductById(id).then((product) => {
      setProduct(product);

      Comments.getCommentsByProductId(id)
        .then((comments) => {
          setComments(comments);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, []);

  const calculateAverageScore = (totalScore, commentCount) => {
    if (comments.length === 0) {
      return 0;
    }

    return totalScore / commentCount;
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

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col space-y-4 w-full items-center justify-center">
        {console.log('product', product)}

        <h1 className="text-xl font-bold">Ürün</h1>
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col space-y-4">
                <div className="flex items-center justify-between space-x-4">
                  <p className="text-orange-500 p-2 bg-orange-100 rounded-full">
                    {calculateAverageScore(product.totalScore, product.commentCount).toFixed(0)}
                  </p>
                  <p className="text-sm font-normal">{product.createdAtFormatted}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <h1 className="text-lg">{product.name}</h1>
            </CardContent>
          </Card>
        </div>

        <h1 className="text-xl font-bold">Yorumlar</h1>
        {comments.map((comment) => (
          <div className="w-full" key={comment.id}>
            <Card>
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

                <p>{comment.content}</p>
                {/* <h1 className="text-sm text-gray-500">Ürün : {comment.productName}</h1> */}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductIdPage;
