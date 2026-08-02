import { Alert, AlertTitle, Button } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";

export default function ErrorAlert({ message, onRetry, t }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button
            color="inherit"
            size="small"
            startIcon={<ReplayIcon />}
            onClick={onRetry}
          >
            {t ? t("retry") : "Retry"}
          </Button>
        )
      }
      sx={{ mb: 3 }}
    >
      <AlertTitle>{t ? t("submissionFailed") : "Submission Failed"}</AlertTitle>
      {message || (t ? t("submissionError") : "Something went wrong. Please try again.")}
    </Alert>
  );
}
