'use client';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <MaxWidthWrapper>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-bold">Admin Paneli</h1>
        
          <Button asChild variant="outline" className="h-32 w-full">
            <Link href="/admin/suggestions" className="flex flex-col items-center justify-center space-y-2">
              <span className="text-lg font-semibold">Öneriler</span>
              <span className="text-sm text-muted-foreground">Kategori ve ürün önerilerini yönetin</span>
            </Link>
          </Button>
      </div>
    </MaxWidthWrapper>
  );
} 