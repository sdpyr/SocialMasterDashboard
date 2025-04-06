import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md mx-4 border-none shadow-lg">
        <CardContent className="pt-8 pb-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text mb-2">
              404 Sayfa Bulunamadı
            </h1>
            <p className="text-gray-500 mb-6">
              Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
