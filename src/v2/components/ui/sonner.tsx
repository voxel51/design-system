import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Read the active theme from the `.dark` class on `<html>`, tracking changes.
 *
 * The Lovable master reads this from `next-themes`. A design system cannot
 * require an application's theme library, and it does not need to: `.dark` on
 * the root element is already the single switch both voodo versions read, so
 * observing it keeps Sonner in step with every other component and drops a
 * dependency.
 */
const useRootTheme = (): "dark" | "light" => {
  const [theme, setTheme] = React.useState<"dark" | "light">(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );

  React.useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return theme;
};

/** Sonner toast host. Mount once, near the application root. */
const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useRootTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
