import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import queryClient from "./lib/queryClient";

const AppProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            fontSize: "13px",
            fontWeight: 700,
            borderRadius: "14px",
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default AppProviders;
