'use client';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Products } from '@/services/Products';
import { RotateCw, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CategoryIdPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Products.getProductsByCategoryId(id)
      .then((products) => {
        setProducts(products);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
        <h1 className="text-xl font-bold">Ürünler</h1>
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Ürün ara..."
            className="w-full rounded-full dark:bg-orange-950 bg-orange-500 placeholder:text-orange-100 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-orange-100" />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="w-full">
              <Button asChild className="w-full">
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </Button>
            </div>
          ))
        ) : (
          <p>Ürün bulunamadı</p>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default CategoryIdPage;
