import { SignInButton } from "@/components/SignInButton";
import { Box, Typography } from "@mui/material";

export default function Home(): JSX.Element {
  return (
    <>
      <Typography variant="h2">Sign in</Typography>
      <Box
        sx={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <SignInButton />
      </Box>
    </>
  );
}
