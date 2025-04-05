import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap } from "lucide-react";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Kullanıcı adı gereklidir" }),
  password: z.string().min(1, { message: "Şifre gereklidir" }),
});

// Register schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır" }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
  displayName: z.string().optional(),
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin" }).optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
      email: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (values: LoginValues) => {
    loginMutation.mutate(values);
  };

  // Handle register form submission
  const onRegisterSubmit = (values: RegisterValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-stretch">
      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-block bg-primary p-2 rounded-lg mb-4">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">SocialMasterPanel</h1>
            <p className="text-muted-foreground mt-2">
              Sosyal medya hesaplarınızı tek panelden yönetin
            </p>
          </div>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Giriş Yap</CardTitle>
                  <CardDescription>
                    Hesabınıza giriş yaparak panele erişin
                  </CardDescription>
                </CardHeader>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kullanıcı Adı</FormLabel>
                            <FormControl>
                              <Input placeholder="Kullanıcı adınız" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifre</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Şifreniz"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Hesap Oluştur</CardTitle>
                  <CardDescription>
                    Hızlıca kayıt olarak paneli kullanmaya başlayın
                  </CardDescription>
                </CardHeader>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kullanıcı Adı</FormLabel>
                            <FormControl>
                              <Input placeholder="Kullanıcı adınız" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad Soyad</FormLabel>
                            <FormControl>
                              <Input placeholder="Adınız ve soyadınız" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-posta</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="E-posta adresiniz"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifre</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Şifreniz"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Kayıt Olunuyor..." : "Kayıt Ol"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden sm:flex flex-1 bg-primary items-center justify-center text-primary-foreground p-8">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">
            Sosyal Medya Yönetiminde Yeni Bir Dönem
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-xl">Güçlü Yönetim Paneli</h3>
                <p className="mt-1 text-primary-foreground/80">
                  Tüm sosyal medya hesaplarınızı tek bir panelden kolayca yönetin
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-xl">Detaylı İstatistikler</h3>
                <p className="mt-1 text-primary-foreground/80">
                  İçeriklerinizin performansını gerçek zamanlı olarak analiz edin
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-xl">Modern Tasarım</h3>
                <p className="mt-1 text-primary-foreground/80">
                  Kullanıcı dostu ve modern arayüz ile verimli çalışma ortamı
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
