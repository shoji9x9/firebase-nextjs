import { PersonalForm } from "@/components/PersonalForm";
import { Box, Typography } from "@mui/material";

export default async function Personal() {
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
