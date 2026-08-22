"use client";

import { StoreProvider } from "@/lib/store";
import { MainApp } from "@/components/MainApp";

export default function Home() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
