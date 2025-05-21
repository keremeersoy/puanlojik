import { Categories } from '@/services/Categories';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Package } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const CategoriesArea = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Categories.getAllCategories()
      .then((fetchedCategories) => {
        setCategories(fetchedCategories || []);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className='w-full'>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kategoriler</h1>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 rounded-md" /> 
                <Skeleton className="h-4 w-1/2 rounded-md mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/4 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">Kategori bulunamadı.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id} className="block group">
              <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 hover:border-orange-500/50 dark:hover:border-orange-500/70 border-transparent border-2">
                <CardHeader className="flex-grow">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-semibold text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                      {category.name}
                    </CardTitle>
                    <Tag className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Package className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{category.productCount} ürün</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesArea;
