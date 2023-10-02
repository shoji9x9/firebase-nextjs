"use client";

import { Alert, Grid, Snackbar, Typography } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { LoginUser, userAtom } from "../states/userAtom";
import { messageAtom } from "../states/messageAtom";
import { SignOutButton } from "@/components/SignOutButton";
import { useEffect } from "react";

export function Header(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setLoginUser = useSetRecoilState(userAtom);
  const [message] = useRecoilState(messageAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);

  const closeMessage = () => {
    setMessageAtom((prev) => {
      return {
        ...prev,
        open: false,
      };
    });
  };

  useEffect(() => {
    let _userId = localStorage.getItem("userId");
    let _userName = localStorage.getItem("userName");
    if (loginUser.userId) {
      _userId = loginUser.userId;
    }
    if (loginUser.userName) {
      _userName = loginUser.userName;
    }
    setLoginUser((prev: LoginUser) => {
      return {
        ...prev,
        userId: _userId || null,
        userName: _userName || null,
      };
    });
  }, [loginUser.userId, loginUser.userName, setLoginUser]);

  // TODO: loginUserを取得する前であってもエリアは確保しておく＆ボタンは表示しておく
  return (
    <>
      <Grid container spacing={2} alignItems="center" className="h-16">
        <Grid container item xs={8}></Grid>
        {loginUser.userId && (
          <Grid container item xs={4} alignItems="center">
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Typography>{loginUser.userName}</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <SignOutButton />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={closeMessage}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={closeMessage}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
}
