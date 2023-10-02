"use client";

import { Box } from "@mui/material";
import { RecoilRoot } from "recoil";
import { Header } from "./Header";

export function RecoilProvider({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Box
        sx={{
          padding: 4,
        }}
      >
        <Header />
        {children}
      </Box>
    </RecoilRoot>
  );
}
