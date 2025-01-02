'use client';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getErrorMessage } from '@/lib/error-messages';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import { Auth } from '@/services/Auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const registerFormSchema = z
  .object({
    name: z.string().nonempty(),
    surname: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

const RegisterPage = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await Auth.registerUser(userCredential.user, data);

      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          toast({
            title: 'Giriş Başarılı',
            description: 'Başarıyla giriş yaptınız',
            variant: 'success',
          });

          router.push('/');
        })
        .catch((error) => {
          console.log('error1', error);
          toast({
            title: getErrorMessage(error),
            variant: 'destructive',
          });
        });
    } catch (error) {
      console.log('error2', error);
      toast({
        title: error.code,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <MaxWidthWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>Yorum yapmak için kayıt olun.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-[30rem] space-y-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Ad</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" placeholder="John" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Soyad</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" placeholder="Doe" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.surname?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="puanlojik@example.com" />
                      </FormControl>
                      <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Password Fields */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Şifre</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} placeholder="*********" />
                      </FormControl>
                      <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Şifreyi Onayla</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} placeholder="*********" />
                      </FormControl>
                      <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="orange"
                  className="w-full"
                  loading={form.formState.isSubmitting ? 'true' : 'false'}
                >
                  Kayıt Ol
                </Button>
              </form>
            </Form>
            <p className="flex justify-center gap-2 pb-6 text-sm">
              Zaten bir hesabınız var mı?
              <Link
                href="/auth/login"
                className="text-orange-500 transition-colors hover:text-orange-500/75"
                onClick={() => router.push('/auth/login')}
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default RegisterPage;
