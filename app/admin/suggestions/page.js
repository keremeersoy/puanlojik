'use client';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Categories } from '@/services/Categories';
import { Products } from '@/services/Products';
import { Check, RotateCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AdminSuggestionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const [categories, products] = await Promise.all([
        Categories.getSuggestedCategories(),
        Products.getSuggestedProducts(),
      ]);

      setSuggestedCategories(categories || []);
      setSuggestedProducts(products || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleApproveCategory = async (categoryId) => {
    try {
      const result = await Categories.approveCategory(categoryId);
      if (result) {
        toast({
          title: 'Kategori onaylandı',
          description: 'Kategori başarıyla aktif hale getirildi.',
          variant: 'success',
        });
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error approving category:', error);
      toast({
        title: 'Bir hata oluştu',
        description: 'Kategori onaylanırken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      const result = await Products.approveProduct(productId);
      if (result) {
        toast({
          title: 'Ürün onaylandı',
          description: 'Ürün başarıyla aktif hale getirildi.',
          variant: 'success',
        });
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: 'Bir hata oluştu',
        description: 'Ürün onaylanırken bir hata oluştu.',
        variant: 'destructive',
      });
    }
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
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-bold">Öneriler</h1>

        <Tabs defaultValue="categories" className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value="categories" className='w-full'>Kategoriler ({suggestedCategories.length})</TabsTrigger>
            <TabsTrigger value="products" className='w-full'>Ürünler ({suggestedProducts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 mt-4 w-full">
            {suggestedCategories.length === 0 ? (
              <p className='text-center'>Onay bekleyen kategori önerisi bulunmuyor.</p>
            ) : (
              suggestedCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleApproveCategory(category.id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription>{category.createdAtFormatted}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{category.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-4 mt-4 w-full">
            {suggestedProducts.length === 0 ? (
              <p className='text-center'>Onay bekleyen ürün önerisi bulunmuyor.</p>
            ) : (
              suggestedProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{product.name}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleApproveProduct(product.id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {product.categoryName} - {product.createdAtFormatted}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{product.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MaxWidthWrapper>
  );
};

export default AdminSuggestionsPage; 