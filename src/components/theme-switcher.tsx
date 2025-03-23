// "use client";

// import * as React from "react";
// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";

// export function ThemeSwitcher() {
//   const { setTheme, theme } = useTheme();

//   const [mounted, setMounted] = React.useState(false);

//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null;
//   }

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark");
//   };

//   return (
//     <div className="flex items-center justify-center">
//       <button
//         onClick={toggleTheme}
//         className="flex items-center justify-center p-2 rounded-full"
//         aria-label="Toggle Theme">
//         {theme === "dark" ? (
//           <Moon className="h-[1.05rem] w-[1.05rem] text-primary transition-all" />
//         ) : (
//           <Sun className="h-[1.05rem] w-[1.05rem] text-primary transition-all" />
//         )}
//       </button>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (mounted) {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-2 rounded-full">
        <div className="h-[1.05rem] w-[1.05rem] bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center p-2 rounded-full"
        aria-label="Toggle Theme">
        {theme === "dark" ? (
          <Moon className="h-[1.05rem] w-[1.05rem] text-primary transition-all" />
        ) : (
          <Sun className="h-[1.05rem] w-[1.05rem] text-primary transition-all" />
        )}
      </button>
    </div>
  );
}
