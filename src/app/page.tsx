import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="flex items-center space-x-4">
                <Image
                  src="/images/logo_lightgrey.png"
                  alt="Pluto Logo"
                  width={80}
                  height={80}
                />
                <span className="text-5xl font-semibold">Pluto</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Unlock Liquidity Using{' '}
                  <span className="text-blue-600">Alternative Assets</span>
                </h1>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Wealth Equity Line of Credit (WELOC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Access competitive-rate lending against your alternative
                  assets, unlocking liquidity without disrupting your investment
                  strategy.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-blue-600" />
                    <span>Competitive interest rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-blue-600" />
                    <span>Asset-backed lending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-blue-600" />
                    <span>Maintain investment positions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
