// resources/js/layouts/AppLayout.tsx

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { ReactNode } from "react";
import { Head, Link } from "@inertiajs/react";

import { AppSidebar } from "@/components/app-sidebar"; // ✅ your working sidebar

export default function AppLayout({
    children,
    title = "",
    breadcrumbs = [],
}: {
    children: ReactNode;
    title?: string;
    breadcrumbs?: Array<{ name: string; href?: string }>;
}) {
    return (
        <SidebarProvider>
            <Head title={title} />
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 transition-[width,height] ease-linear">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {breadcrumbs?.length > 0 && (
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <BreadcrumbItem
                                                className={
                                                    index < breadcrumbs.length - 1 ? "hidden md:block" : ""
                                                }
                                            >
                                                {item.href ? (
                                                    <Link
                                                        href={item.href}
                                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ) : (
                                                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>
                                            {index < breadcrumbs.length - 1 && (
                                                <BreadcrumbSeparator className="hidden md:block" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        )}
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
