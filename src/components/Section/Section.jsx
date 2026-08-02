import { Card, CardContent, Typography, Box } from "@mui/material";

// Renders a form section as a card with a heading and its fields.
export default function Section({ title, order, children }) {
  return (
    <Card
      elevation={2}
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          {order != null && (
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {order}
            </Box>
          )}
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
