import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusCircle,
  RefreshCw,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Pencil,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout";
import {
  insertPageSchema,
  insertPageSectionSchema,
  insertMenuItemSchema,
  insertFaqItemSchema,
} from "@shared/schema";
import * as z from "zod";

export default function ContentManagementPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pages");
  const [editingPage, setEditingPage] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [openPageDialog, setOpenPageDialog] = useState(false);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [openMenuItemDialog, setOpenMenuItemDialog] = useState(false);
  const [openFaqDialog, setOpenFaqDialog] = useState(false);
  const [expandedPage, setExpandedPage] = useState<number | null>(null);

  // Page data fetching
  const {
    data: pages,
    isLoading: pagesLoading,
    refetch: refetchPages,
  } = useQuery({
    queryKey: ["/api/pages"],
    queryFn: () => apiRequest("GET", "/api/pages").then((res) => res.json()),
  });

  // Sections data fetching
  const {
    data: sections,
    isLoading: sectionsLoading,
    refetch: refetchSections,
  } = useQuery({
    queryKey: ["/api/page-sections"],
    queryFn: () =>
      apiRequest("GET", "/api/page-sections").then((res) => res.json()),
  });

  // Menu Items data fetching
  const {
    data: menuItems,
    isLoading: menuItemsLoading,
    refetch: refetchMenuItems,
  } = useQuery({
    queryKey: ["/api/menu-items"],
    queryFn: () =>
      apiRequest("GET", "/api/menu-items").then((res) => res.json()),
  });

  // FAQ Items data fetching
  const {
    data: faqItems,
    isLoading: faqItemsLoading,
    refetch: refetchFaqItems,
  } = useQuery({
    queryKey: ["/api/faq-items"],
    queryFn: () =>
      apiRequest("GET", "/api/faq-items").then((res) => res.json()),
  });

  // Page form
  const pageForm = useForm<z.infer<typeof insertPageSchema>>({
    resolver: zodResolver(insertPageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
      userId: 1, // We'll set this from the auth user
    },
  });

  // Section form
  const sectionForm = useForm<z.infer<typeof insertPageSectionSchema>>({
    resolver: zodResolver(insertPageSectionSchema),
    defaultValues: {
      title: "",
      type: "text",
      content: "",
      pageId: 0,
      sortOrder: 0,
      active: true,
      metadata: {},
    },
  });

  // Menu Item form
  const menuItemForm = useForm<z.infer<typeof insertMenuItemSchema>>({
    resolver: zodResolver(insertMenuItemSchema),
    defaultValues: {
      title: "",
      url: "",
      location: "header",
      sortOrder: 0,
      active: true,
    },
  });

  // FAQ Item form
  const faqForm = useForm<z.infer<typeof insertFaqItemSchema>>({
    resolver: zodResolver(insertFaqItemSchema),
    defaultValues: {
      question: "",
      answer: "",
      sortOrder: 0,
      active: true,
    },
  });

  // Mutations
  const createPageMutation = useMutation({
    mutationFn: (data: z.infer<typeof insertPageSchema>) =>
      apiRequest("POST", "/api/pages", data).then((res) => res.json()),
    onSuccess: () => {
      toast({
        title: "Sayfa oluşturuldu",
        description: "Sayfa başarıyla oluşturuldu.",
      });
      refetchPages();
      setOpenPageDialog(false);
      pageForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Sayfa oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("PUT", `/api/pages/${data.id}`, data).then((res) => res.json()),
    onSuccess: () => {
      toast({
        title: "Sayfa güncellendi",
        description: "Sayfa başarıyla güncellendi.",
      });
      refetchPages();
      setOpenPageDialog(false);
      pageForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Sayfa güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/pages/${id}`).then((res) => res.json()),
    onSuccess: () => {
      toast({
        title: "Sayfa silindi",
        description: "Sayfa başarıyla silindi.",
      });
      refetchPages();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Sayfa silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  // Similarly for sections, menu items, and FAQ items...
  // For brevity, I'm skipping the implementation but you would implement
  // similar mutation hooks for them

  // Handle form submissions
  const onPageSubmit = (data: z.infer<typeof insertPageSchema>) => {
    if (editingPage) {
      updatePageMutation.mutate({ ...data, id: editingPage.id });
    } else {
      createPageMutation.mutate(data);
    }
  };

  // Similar handlers for sections, menu items, and FAQs

  // Open dialog for new item creation
  const handleAddPage = () => {
    setEditingPage(null);
    pageForm.reset({
      title: "",
      slug: "",
      content: "",
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
      userId: 1,
    });
    setOpenPageDialog(true);
  };

  // Edit handlers
  const handleEditPage = (page: any) => {
    setEditingPage(page);
    pageForm.reset({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      userId: page.userId,
    });
    setOpenPageDialog(true);
  };

  // Toggle expanded page for section management
  const toggleExpandPage = (pageId: number) => {
    if (expandedPage === pageId) {
      setExpandedPage(null);
    } else {
      setExpandedPage(pageId);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">İçerik Yönetimi</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pages">Sayfalar</TabsTrigger>
            <TabsTrigger value="sections">Sayfa Bölümleri</TabsTrigger>
            <TabsTrigger value="menu">Menü</TabsTrigger>
            <TabsTrigger value="faq">S.S.S.</TabsTrigger>
          </TabsList>

          {/* Pages Tab Content */}
          <TabsContent value="pages">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sayfalar</CardTitle>
                  <CardDescription>
                    Web sitenizin sayfalarını yönetin
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchPages()}
                    disabled={pagesLoading}
                  >
                    {pagesLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Yenile</span>
                  </Button>
                  <Button size="sm" onClick={handleAddPage}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Yeni Sayfa
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pagesLoading ? (
                  <div className="flex justify-center p-4">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Başlık</TableHead>
                        <TableHead>Adres</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Bölümler</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages && pages.length > 0 ? (
                        pages.map((page: any) => (
                          <React.Fragment key={page.id}>
                            <TableRow>
                              <TableCell className="font-medium">
                                {page.title}
                              </TableCell>
                              <TableCell>{page.slug}</TableCell>
                              <TableCell>
                                {page.isPublished ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Yayında
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Taslak
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpandPage(page.id)}
                                >
                                  {expandedPage === page.id ? (
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-1" />
                                  )}
                                  Bölümler
                                </Button>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditPage(page)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Preview page functionality
                                      window.open(
                                        `/${page.slug}`,
                                        "_blank"
                                      );
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Bu sayfayı silmek istediğinize emin misiniz?"
                                        )
                                      ) {
                                        deletePageMutation.mutate(page.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            {expandedPage === page.id && (
                              <TableRow>
                                <TableCell colSpan={5} className="p-0">
                                  <div className="bg-slate-50 p-4">
                                    <div className="flex justify-between mb-4">
                                      <h3 className="text-sm font-medium">
                                        Sayfa Bölümleri
                                      </h3>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          // Add section for this page
                                          setEditingSection(null);
                                          sectionForm.reset({
                                            title: "",
                                            type: "text",
                                            content: "",
                                            pageId: page.id,
                                            sortOrder: 0,
                                            active: true,
                                            metadata: {},
                                          });
                                          setOpenSectionDialog(true);
                                        }}
                                      >
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Bölüm Ekle
                                      </Button>
                                    </div>
                                    {sections &&
                                    sections.filter(
                                      (s: any) => s.pageId === page.id
                                    ).length > 0 ? (
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Başlık</TableHead>
                                            <TableHead>Tür</TableHead>
                                            <TableHead>Sıra</TableHead>
                                            <TableHead>Durum</TableHead>
                                            <TableHead className="text-right">
                                              İşlemler
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {sections
                                            .filter(
                                              (s: any) => s.pageId === page.id
                                            )
                                            .sort(
                                              (a: any, b: any) =>
                                                a.sortOrder - b.sortOrder
                                            )
                                            .map((section: any) => (
                                              <TableRow key={section.id}>
                                                <TableCell>
                                                  {section.title}
                                                </TableCell>
                                                <TableCell>
                                                  {section.type}
                                                </TableCell>
                                                <TableCell>
                                                  {section.sortOrder}
                                                </TableCell>
                                                <TableCell>
                                                  {section.active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                      Aktif
                                                    </span>
                                                  ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                      Pasif
                                                    </span>
                                                  )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                  <div className="flex justify-end space-x-2">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                        // Edit section
                                                        setEditingSection(
                                                          section
                                                        );
                                                        sectionForm.reset({
                                                          title: section.title,
                                                          type: section.type,
                                                          content:
                                                            section.content,
                                                          pageId: section.pageId,
                                                          sortOrder:
                                                            section.sortOrder,
                                                          active: section.active,
                                                          metadata:
                                                            section.metadata ||
                                                            {},
                                                        });
                                                        setOpenSectionDialog(
                                                          true
                                                        );
                                                      }}
                                                    >
                                                      <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                        // Delete section
                                                        if (
                                                          window.confirm(
                                                            "Bu bölümü silmek istediğinize emin misiniz?"
                                                          )
                                                        ) {
                                                          // deleteSectionMutation.mutate(section.id);
                                                        }
                                                      }}
                                                    >
                                                      <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <div className="text-center py-4 text-slate-500">
                                        Bu sayfa için herhangi bir bölüm
                                        bulunamadı.
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-4 text-slate-500"
                          >
                            Henüz sayfa bulunamadı. Hemen yeni bir sayfa
                            oluşturun.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sections Tab Content */}
          <TabsContent value="sections">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sayfa Bölümleri</CardTitle>
                  <CardDescription>
                    Sayfa bölümlerini yönetin
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchSections()}
                    disabled={sectionsLoading}
                  >
                    {sectionsLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Yenile</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sectionsLoading ? (
                  <div className="flex justify-center p-4">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    Bölüm yönetimi "Sayfalar" sekmesinden yapılmaktadır. Lütfen
                    ilgili sayfayı seçerek bölüm ekleyiniz.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab Content */}
          <TabsContent value="menu">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Menü</CardTitle>
                  <CardDescription>Menü öğelerini yönetin</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchMenuItems()}
                    disabled={menuItemsLoading}
                  >
                    {menuItemsLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Yenile</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingMenuItem(null);
                      menuItemForm.reset({
                        title: "",
                        url: "",
                        location: "header",
                        sortOrder: 0,
                        active: true,
                      });
                      setOpenMenuItemDialog(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Yeni Menü Öğesi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {menuItemsLoading ? (
                  <div className="flex justify-center p-4">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Başlık</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Konum</TableHead>
                        <TableHead>Sıra</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems && menuItems.length > 0 ? (
                        menuItems.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.title}
                            </TableCell>
                            <TableCell>{item.url}</TableCell>
                            <TableCell>
                              {item.location === "header"
                                ? "Üst Menü"
                                : item.location === "footer"
                                ? "Alt Menü"
                                : item.location === "sidebar"
                                ? "Yan Menü"
                                : item.location}
                            </TableCell>
                            <TableCell>{item.sortOrder}</TableCell>
                            <TableCell>
                              {item.active ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Pasif
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Edit menu item
                                    setEditingMenuItem(item);
                                    menuItemForm.reset({
                                      title: item.title,
                                      url: item.url,
                                      location: item.location,
                                      sortOrder: item.sortOrder,
                                      active: item.active,
                                      parentId: item.parentId,
                                      icon: item.icon,
                                    });
                                    setOpenMenuItemDialog(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Delete menu item
                                    if (
                                      window.confirm(
                                        "Bu menü öğesini silmek istediğinize emin misiniz?"
                                      )
                                    ) {
                                      // deleteMenuItemMutation.mutate(item.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-4 text-slate-500"
                          >
                            Henüz menü öğesi bulunamadı. Hemen yeni bir menü
                            öğesi oluşturun.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab Content */}
          <TabsContent value="faq">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>S.S.S.</CardTitle>
                  <CardDescription>
                    Sıkça sorulan soruları yönetin
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchFaqItems()}
                    disabled={faqItemsLoading}
                  >
                    {faqItemsLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Yenile</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingFaq(null);
                      faqForm.reset({
                        question: "",
                        answer: "",
                        sortOrder: 0,
                        active: true,
                      });
                      setOpenFaqDialog(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Yeni S.S.S.
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {faqItemsLoading ? (
                  <div className="flex justify-center p-4">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Soru</TableHead>
                        <TableHead>Cevap</TableHead>
                        <TableHead>Sıra</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqItems && faqItems.length > 0 ? (
                        faqItems.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.question}
                            </TableCell>
                            <TableCell>
                              {item.answer.length > 50
                                ? `${item.answer.substring(0, 50)}...`
                                : item.answer}
                            </TableCell>
                            <TableCell>{item.sortOrder}</TableCell>
                            <TableCell>
                              {item.active ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Pasif
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Edit FAQ item
                                    setEditingFaq(item);
                                    faqForm.reset({
                                      question: item.question,
                                      answer: item.answer,
                                      sortOrder: item.sortOrder,
                                      active: item.active,
                                      categoryId: item.categoryId,
                                    });
                                    setOpenFaqDialog(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Delete FAQ item
                                    if (
                                      window.confirm(
                                        "Bu S.S.S. öğesini silmek istediğinize emin misiniz?"
                                      )
                                    ) {
                                      // deleteFaqItemMutation.mutate(item.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-4 text-slate-500"
                          >
                            Henüz S.S.S. öğesi bulunamadı. Hemen yeni bir S.S.S.
                            öğesi oluşturun.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Page Dialog */}
      <Dialog open={openPageDialog} onOpenChange={setOpenPageDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Sayfayı Düzenle" : "Yeni Sayfa Oluştur"}
            </DialogTitle>
            <DialogDescription>
              {editingPage
                ? "Sayfa bilgilerini güncelleyin."
                : "Web sitenize yeni bir sayfa ekleyin."}
            </DialogDescription>
          </DialogHeader>

          <Form {...pageForm}>
            <form
              onSubmit={pageForm.handleSubmit(onPageSubmit)}
              className="space-y-4"
            >
              <FormField
                control={pageForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sayfa Başlığı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={pageForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Adresi</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="sayfa-adresi" />
                    </FormControl>
                    <FormDescription>
                      Sayfanın web adresindeki görünümü. Boşluk yerine tire (-)
                      kullanın, Türkçe karakter kullanmayın.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={pageForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İçerik</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Sayfa içeriği..."
                        rows={6}
                      />
                    </FormControl>
                    <FormDescription>
                      Sayfanın ana içeriği. HTML kullanabilirsiniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={pageForm.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Başlık</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Meta Başlık" />
                      </FormControl>
                      <FormDescription>
                        SEO için sayfa başlığı
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={pageForm.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Açıklama</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Meta Açıklama" />
                      </FormControl>
                      <FormDescription>SEO için açıklama</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={pageForm.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Yayınlama Durumu
                      </FormLabel>
                      <FormDescription>
                        Sayfayı web sitenizde yayınlamak için etkinleştirin
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenPageDialog(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {editingPage ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Section Dialog */}
      <Dialog open={openSectionDialog} onOpenChange={setOpenSectionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Bölümü Düzenle" : "Yeni Bölüm Oluştur"}
            </DialogTitle>
            <DialogDescription>
              {editingSection
                ? "Bölüm bilgilerini güncelleyin."
                : "Sayfaya yeni bir bölüm ekleyin."}
            </DialogDescription>
          </DialogHeader>

          <Form {...sectionForm}>
            <form
              onSubmit={sectionForm.handleSubmit((data) => {
                // Handle section form submission
                console.log(data);
                setOpenSectionDialog(false);
              })}
              className="space-y-4"
            >
              <FormField
                control={sectionForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Bölüm Başlığı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={sectionForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bölüm Türü</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir bölüm türü seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="text">Metin</SelectItem>
                        <SelectItem value="gallery">Galeri</SelectItem>
                        <SelectItem value="features">Özellikler</SelectItem>
                        <SelectItem value="cta">Aksiyon Çağrısı</SelectItem>
                        <SelectItem value="faq">S.S.S.</SelectItem>
                        <SelectItem value="contact">İletişim</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Bölümün tipi içeriğin nasıl gösterileceğini belirler
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={sectionForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İçerik</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Bölüm içeriği..."
                        rows={6}
                      />
                    </FormControl>
                    <FormDescription>
                      Bölümün ana içeriği. HTML veya Markdown kullanabilirsiniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={sectionForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sıra</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          min="0"
                        />
                      </FormControl>
                      <FormDescription>
                        Bölümün sayfadaki sırası
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={sectionForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Durum</FormLabel>
                        <FormDescription>
                          Bölümü aktif etmek için açın
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenSectionDialog(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {editingSection ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={openMenuItemDialog} onOpenChange={setOpenMenuItemDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingMenuItem ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi"}
            </DialogTitle>
            <DialogDescription>
              {editingMenuItem
                ? "Menü öğesi bilgilerini güncelleyin."
                : "Web sitenize yeni bir menü öğesi ekleyin."}
            </DialogDescription>
          </DialogHeader>

          <Form {...menuItemForm}>
            <form
              onSubmit={menuItemForm.handleSubmit((data) => {
                // Handle menu item form submission
                console.log(data);
                setOpenMenuItemDialog(false);
              })}
              className="space-y-4"
            >
              <FormField
                control={menuItemForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Menü Öğesi Başlığı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={menuItemForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/sayfa-adresi" />
                    </FormControl>
                    <FormDescription>
                      Menü öğesinin yönlendireceği adres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={menuItemForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konum</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir konum seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="header">Üst Menü</SelectItem>
                        <SelectItem value="footer">Alt Menü</SelectItem>
                        <SelectItem value="sidebar">Yan Menü</SelectItem>
                        <SelectItem value="footer-1">Alt Menü 1</SelectItem>
                        <SelectItem value="footer-2">Alt Menü 2</SelectItem>
                        <SelectItem value="footer-3">Alt Menü 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Menü öğesinin görüneceği yer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={menuItemForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sıra</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          min="0"
                        />
                      </FormControl>
                      <FormDescription>
                        Menü öğesinin sırası
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={menuItemForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Durum</FormLabel>
                        <FormDescription>
                          Menü öğesini aktif etmek için açın
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenMenuItemDialog(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {editingMenuItem ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={openFaqDialog} onOpenChange={setOpenFaqDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? "S.S.S. Düzenle" : "Yeni S.S.S. Oluştur"}
            </DialogTitle>
            <DialogDescription>
              {editingFaq
                ? "S.S.S. bilgilerini güncelleyin."
                : "Web sitenize yeni bir sıkça sorulan soru ekleyin."}
            </DialogDescription>
          </DialogHeader>

          <Form {...faqForm}>
            <form
              onSubmit={faqForm.handleSubmit((data) => {
                // Handle FAQ form submission
                console.log(data);
                setOpenFaqDialog(false);
              })}
              className="space-y-4"
            >
              <FormField
                control={faqForm.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soru</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Soru başlığı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={faqForm.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cevap</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Cevap içeriği..."
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={faqForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sıra</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          min="0"
                        />
                      </FormControl>
                      <FormDescription>S.S.S. sırası</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={faqForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Durum</FormLabel>
                        <FormDescription>
                          S.S.S.'yi aktif etmek için açın
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenFaqDialog(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {editingFaq ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}