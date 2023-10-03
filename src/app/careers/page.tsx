import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function Careers() {
  return (
    <>
      <Typography variant="h2">Careers</Typography>
      <Box
        sx={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <Link href="/personal">
            <Button variant="contained">Personal information</Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
