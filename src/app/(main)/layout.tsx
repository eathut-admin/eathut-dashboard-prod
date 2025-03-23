"use client";

import "@/app/globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IoArrowBackOutline } from "react-icons/io5";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { RxReload } from "react-icons/rx";
import { useState } from "react";

// export default function Layout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const pathname = usePathname();
//   const [rotate, setRotate] = useState(false);

//   const handleClick = () => {
//     setRotate(true);
//     setTimeout(() => {
//       setRotate(false);
//     }, 5000);
//     window.location.reload();
//   };

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
//           <div className="flex items-center gap-2">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="h-4 w-[0.5px] bg-black/50 dark:bg-white"
//             />
//             <ThemeSwitcher />
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="border rounded-md overflow-hidden bg-gray-50 dark:bg-zinc-700">
//               <button
//                 className={`transition-transform duration-1000 h-[33px] w-12 flex items-center justify-center ${
//                   rotate ? "rotate-[1080deg] cursor-not-allowed" : ""
//                 }`}
//                 disabled={rotate}
//                 title="Refresh"
//                 onClick={handleClick}>
//                 <RxReload className="text-xs sm:text-sm md:text-base" />
//               </button>
//             </div>
//             {pathname !== "/dashboard" && (
//               <div className="h-[26px] md:h-[34px]">
//                 <Button
//                   className="h-full w-7 md:w-full"
//                   title="Go Back"
//                   onClick={() => history.back()}>
//                   <IoArrowBackOutline className="text-xs sm:text-sm md:text-base" />
//                   <span className="hidden md:inline-block">Go Back</span>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </header>
//         <div className="p-4 pt-0">{children}</div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [rotate, setRotate] = useState(false);

  const handleClick = () => {
    setRotate(true);
    setTimeout(() => {
      setRotate(false);
    }, 5000);
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="h-4 w-[0.5px] bg-black/50 dark:bg-white"
            />
            <ThemeSwitcher />
          </div>
          <div className="flex items-center gap-4">
            <div className="border rounded-md overflow-hidden bg-gray-50 dark:bg-zinc-700">
              <button
                className={`transition-transform duration-1000 h-[33px] w-12 flex items-center justify-center ${
                  rotate ? "rotate-[1080deg] cursor-not-allowed" : ""
                }`}
                disabled={rotate}
                title="Refresh"
                onClick={handleClick}>
                <RxReload className="text-xs sm:text-sm md:text-base" />
              </button>
            </div>
            {pathname !== "/dashboard" && (
              <div className="h-[26px] md:h-[34px]">
                <Button
                  className="h-full w-7 md:w-full"
                  title="Go Back"
                  onClick={() => history.back()}>
                  <IoArrowBackOutline className="text-xs sm:text-sm md:text-base" />
                  <span className="hidden md:inline-block">Go Back</span>
                </Button>
              </div>
            )}
          </div>
        </header>
        <div className="p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
