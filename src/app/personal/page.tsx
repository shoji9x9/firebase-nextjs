import { PersonalForm } from "@/components/PersonalForm";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function Personal() {
  return (
    <>
      <Typography variant="h2">Personal information</Typography>
      <Box
        sx={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <PersonalForm />
      </Box>
    </>
  );
}
