'use client';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import useUser from '@/hooks/use-user';
import { Categories } from '@/services/Categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RotateCw } from 'lucide-react';


const suggestCategorySchema = z.object({
  name: z.string().min(3, 'Kategori adı en az 3 karakter olmalıdır.').max(50, 'Kategori adı en fazla 50 karakter olabilir.'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.').max(500, 'Açıklama en fazla 500 karakter olabilir.'),
});

const SuggestCategoryPage = () => {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(suggestCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    if (!user) {
      return toast({
        title: 'Kategori önerisi yapabilmek için giriş yapmalısınız.',
        variant: 'destructive',
      });
    }

    try {
      const result = await Categories.suggestNewCategory(data, user);
      if (result) {
        toast({
          title: 'Kategori öneriniz başarıyla alındı.',
          description: 'Öneriniz incelendikten sonra aktif hale getirilecektir.',
          variant: 'success',
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Error suggesting category:', error);
      toast({
        title: 'Bir hata oluştu',
        description: 'Kategori önerisi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
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
          <CardTitle>Yeni Kategori Öner</CardTitle>
          <CardDescription>
            Sistemde görmek istediğiniz yeni bir kategori önerisinde bulunun. Öneriniz incelendikten sonra uygun görülürse
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
                    <FormLabel>Kategori Adı</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Örn: Akıllı Saatler" />
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
                        placeholder="Bu kategoriyi neden önerdiğinizi ve ne tür ürünleri kapsayacağını açıklayın..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" variant="orange">
                Kategori Öner
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default SuggestCategoryPage; 