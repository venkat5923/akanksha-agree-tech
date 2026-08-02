import { Box, Typography, Button, Grow } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function SuccessMessage({ title, description, resetLabel, onReset }) {
  return (
    <Grow in={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          gap: 2,
          textAlign: "center",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 72, color: "success.main" }} />
        <Typography variant="h5" fontWeight={600} color="success.main">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {onReset && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onReset}
            sx={{ mt: 1 }}
          >
            {resetLabel}
          </Button>
        )}
      </Box>
    </Grow>
  );
}
