'use client';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/error-messages';
import { auth } from '@/lib/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [passwordType, setPasswordType] = useState('password');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          router.push('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          return toast({
            title: errorMessage,
            variant: 'destructive',
          });
        });
    } catch (error) {
      toast({
        title: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MaxWidthWrapper>
      <Card className="w-full sm:w-[500px]">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>Yorum yapmak için giriş yapın.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={passwordType} placeholder="********" {...field} />
                        {passwordType === 'password' ? (
                          <Eye
                            size={20}
                            className="absolute right-4 top-2 cursor-pointer bg-background"
                            onClick={() => setPasswordType('text')}
                          />
                        ) : (
                          <EyeOff
                            size={20}
                            className="absolute right-4 top-2 cursor-pointer bg-background"
                            onClick={() => setPasswordType('password')}
                          />
                        )}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="orange" disabled={loading} type="submit">
                Giriş Yap
              </Button>
            </CardFooter>
          </form>
        </Form>
        <p className="flex justify-center gap-2 pb-6 text-sm">
          Hesabınız yok mu?{' '}
          <Link
            href="/auth/register"
            className="text-orange-500 transition-colors hover:text-orange-500/75"
            onClick={() => router.push('/auth/register')}
          >
            Kayıt Ol
          </Link>
        </p>
      </Card>
    </MaxWidthWrapper>
  );
};

export default Login;
