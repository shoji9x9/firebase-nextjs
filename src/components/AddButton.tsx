import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Divider, IconButton } from "@mui/material";

export function AddButton({
  key,
  onClick,
}: {
  key?: string;
  onClick?: () => void;
}) {
  return (
    <Box className="mt-10 mb-4 text-center">
      <Divider />
      <IconButton
        aria-label="add"
        className="p-0 opacity-50 hover:opacity-100"
        color="primary"
        onClick={onClick}
        key={key}
      >
        <AddCircleIcon className="relative -top-6 h-100 text-5xl" />
      </IconButton>
    </Box>
  );
}
