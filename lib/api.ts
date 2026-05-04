const usePhpBackend = process.env.NEXT_PUBLIC_BACKEND === "php";

export function apiEndpoint(name: "leads" | "login" | "logout") {
  return usePhpBackend ? `/api/${name}.php` : `/api/${name}`;
}

