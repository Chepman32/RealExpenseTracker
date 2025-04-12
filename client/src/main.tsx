import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./context/LanguageContext";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#00FF99",
        colorError: "#ff4d4f",
        colorSuccess: "#00FF99",
        colorWarning: "#faad14",
        colorInfo: "#1A2A44",
        colorTextBase: "#1A2A44",
        fontFamily: "Inter, sans-serif",
      },
      components: {
        Button: {
          primaryColor: "#1A2A44",
        },
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ConfigProvider>
);
