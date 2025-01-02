import { Categories } from '@/services/Categories';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const CategoriesArea = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Categories.getAllCategories()
      .then((categories) => {
        setCategories(categories);
      })
      .catch((error) => {
        console.log('fetchedCategories', error);
      });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Tüm Kategoriler</h1>

      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <div key={category.id}>
            <Button variant="outline" asChild>
              <Link href={`/category/${category.id}`}>{category.name}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesArea;
