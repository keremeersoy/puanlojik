'use client';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import useUser from '@/hooks/use-user';
import { Products } from '@/services/Products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RotateCw } from 'lucide-react';

const suggestProductSchema = z.object({
  name: z.string().min(3, 'Ürün adı en az 3 karakter olmalıdır.').max(100, 'Ürün adı en fazla 100 karakter olabilir.'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.').max(500, 'Açıklama en fazla 500 karakter olabilir.'),
});

const SuggestProductPage = () => {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  const form = useForm({
    resolver: zodResolver(suggestProductSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    if (!user) {
      return toast({
        title: 'Ürün önerisi yapabilmek için giriş yapmalısınız.',
        variant: 'destructive',
      });
    }

    if (!categoryId) {
      return toast({
        title: 'Kategori bilgisi eksik',
        description: 'Ürün önerisi için geçerli bir kategori seçilmelidir.',
        variant: 'destructive',
      });
    }

    try {
      const productData = {
        ...data,
        categoryId,
      };

      const result = await Products.suggestNewProduct(productData, user);
      if (result) {
        toast({
          title: 'Ürün öneriniz başarıyla alındı.',
          description: 'Öneriniz incelendikten sonra aktif hale getirilecektir.',
          variant: 'success',
        });
        router.push(`/category/${categoryId}`);
      }
    } catch (error) {
      console.error('Error suggesting product:', error);
      toast({
        title: 'Bir hata oluştu',
        description: 'Ürün önerisi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Yeni Ürün Öner</CardTitle>
          <CardDescription>
            Bu kategoriye eklemek istediğiniz yeni bir ürün önerisinde bulunun. Öneriniz incelendikten sonra uygun görülürse
            aktif hale getirilecektir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ürün Adı</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Örn: iPhone 15 Pro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Bu ürünü neden önerdiğinizi ve özelliklerini açıklayın..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" variant="orange">
                Ürün Öner
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default SuggestProductPage; 