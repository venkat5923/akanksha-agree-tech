import { Card, CardContent, Typography, Box } from "@mui/material";

// Renders a form section as a card with a heading and its fields.
export default function Section({ title, order, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        mb: { xs: 2.5, sm: 3.5 },
        borderRadius: { xs: 2.5, sm: 3 },
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        overflow: "visible",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.07)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: { xs: 2, sm: 2.5 } }}>
          {order != null && (
            <Box
              sx={{
                width: { xs: 26, sm: 30 },
                height: { xs: 26, sm: 30 },
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { xs: "0.8rem", sm: "0.88rem" },
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: "0 2px 5px rgba(46, 125, 50, 0.3)",
              }}
            >
              {order}
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.05rem", sm: "1.18rem" },
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { xs: 2, sm: 2.5 },
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
