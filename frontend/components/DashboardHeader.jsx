"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardHeader = () => {
  const pathname = usePathname().split("/").slice(1);

  return (
    <div className="fixed top-20 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-12 shadow flex justify-between px-5  items-center">
      <Breadcrumb>
        <BreadcrumbList>
          {pathname.map((item, ind) => {
            if (ind !== pathname.length - 1) {
              return (
                <React.Fragment key={ind}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={"./"}>
                      <span className="capitalize underline-offset-4 hover:underline">
                        {item}
                      </span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              );
            } else {
              return (
                <BreadcrumbItem key={ind}>
                  <BreadcrumbPage>
                    <span className="capitalize font-semibold ">{item}</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              );
            }
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3">
        <h1>Mr Zahran L.M</h1>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Za</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
