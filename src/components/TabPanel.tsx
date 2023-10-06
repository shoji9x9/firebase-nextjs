import { Box } from "@mui/material";

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...others } = props;

  return (
    <Box
      sx={{
        padding: "20px",
      }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...others}
    >
      {value === index && <>{children}</>}
    </Box>
  );
}
