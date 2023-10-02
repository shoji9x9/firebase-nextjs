import { SignInButton } from "@/components/SignInButton";
import { Box, Button, Typography } from "@mui/material";
// import { setUserToLocalStorage, signInWithGoogle } from "../utils/auth";
// import { useRecoilState, useSetRecoilState } from "recoil";
// import { userAtom } from "../states/userAtom";
// import { useNavigate } from "react-router-dom";

export default function Home(): JSX.Element {
  // const [loginUser] = useRecoilState(userAtom);
  // const setUserAtom = useSetRecoilState(userAtom);
  // const navigate = useNavigate();

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
