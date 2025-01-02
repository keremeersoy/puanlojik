'use client';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useUser from '@/hooks/use-user';
import { Categories } from '@/services/Categories';
import { Products } from '@/services/Products';
import { RotateCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Comments } from '@/services/Comments';
import { useToast } from '@/hooks/use-toast';

const createCommentSchema = z.object({
  categoryId: z.string(),
  productId: z.string(),
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(500),
  score: z.number().int().min(1).max(100),
});

const CreateCommentPage = () => {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const form = useForm({
    resolver: zodResolver(createCommentSchema),
  });

  useEffect(() => {
    Categories.getAllCategories().then((categories) => {
      setCategories(categories);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      Products.getProductsByCategoryId(selectedCategory).then((products) => {
        setProducts(products);
      });
    }
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleCreateComment = async (data) => {
    console.log('data', data);

    if (!user) {
      return toast({
        title: 'Yorum yapabilmek için giriş yapmalısınız.',
        variant: 'destructive',
      });
    }

    console.log('user', user);
    try {
      Comments.createComment(data, user).then((result) => {
        toast({
          title: 'Yorum başarıyla oluşturuldu.',
          description: 'Yorumunuz incelendikten sonra yayınlanacaktır.',
          variant: 'success',
        });
      });
    } catch (error) {
      console.error('Error creating comment:', error);
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
      <Card className="w-[40rem]">
        <CardHeader>Yorum Yap</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateComment)}>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCategoryChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCategory}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Ürün seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başlık</FormLabel>
                      <Input {...field} value={field.value || ''} placeholder="Başlık" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İçerik</FormLabel>
                      <Textarea {...field} value={field.value || ''} placeholder="İçerik" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Puan ( 0 - 100 )</FormLabel>
                      <Input
                        {...field}
                        type="number"
                        value={field.value || ''}
                        placeholder="Puan"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="success">
                  Yorumla
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default CreateCommentPage;
