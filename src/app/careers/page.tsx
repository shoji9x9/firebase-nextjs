"use client";

import { CareerList } from "@/components/CareerList";
import { PersonalForm } from "@/components/PersonalForm";
import { SimpleDialog } from "@/components/SimpleDialog";
import { TabPanel } from "@/components/TabPanel";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useCallback, useState } from "react";

export default function Careers() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    openDialog: false,
    nextTabIndex: 0,
  });

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      if (dirty) {
        setConfirmDialog({ openDialog: true, nextTabIndex: newValue });
      } else {
        setSelectedTab(newValue);
      }
    },
    [dirty]
  );

  return (
    <>
      <Typography variant="h2">Careers</Typography>
      <Box
        sx={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="type tab"
          // selectionFollowsFocus  // このオプションを付与すると確認ダイアログでキャンセルボタンを押すと無限に確認ダイアログが表示される
        >
          <Tab
            label="Personal information"
            id="tabPersonalInfo"
            aria-controls="tabPersonalInfo"
          />
          <Tab label="Careers" id="tabCareers" aria-controls="tabCareers" />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <Typography variant="h3">Personal information</Typography>
          <Box
            sx={{
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            <PersonalForm setDirty={setDirty} />
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Typography variant="h3">Careers</Typography>
          <Box
            sx={{
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            <CareerList setDirty={setDirty} />
          </Box>
        </TabPanel>
        <SimpleDialog
          open={confirmDialog.openDialog}
          handleClose={() =>
            setConfirmDialog((prev) => ({
              openDialog: false,
              nextTabIndex: prev.nextTabIndex,
            }))
          }
          title="Confirmation"
          content="Are you sure you want to switch tabs without saving your changes?"
          actions={[
            {
              text: "Switch",
              onClick: () => {
                setDirty(false);
                setSelectedTab(confirmDialog.nextTabIndex);
                setConfirmDialog((prev) => ({
                  openDialog: false,
                  nextTabIndex: prev.nextTabIndex,
                }));
              },
            },
            {
              text: "Cancel",
              onClick: () => {
                console.log("cancel");
                setConfirmDialog((prev) => ({
                  openDialog: false,
                  nextTabIndex: prev.nextTabIndex,
                }));
              },
              autoFocus: true,
            },
          ]}
        />
      </Box>
    </>
  );
}
