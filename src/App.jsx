import { useState } from "react";
import { Box, Tabs, Tab, Typography, AppBar, Toolbar, Button } from "@mui/material";
import GrassIcon from "@mui/icons-material/Grass";
import EngineeringIcon from "@mui/icons-material/Engineering";
import TranslateIcon from "@mui/icons-material/Translate";
import DynamicForm from "./components/DynamicForm/DynamicForm.jsx";
import Loader from "./components/Loader/Loader.jsx";
import { useFormConfig } from "./hooks/useFormConfig.js";
import { LanguageProvider, useLanguage } from "./context/LanguageContext.jsx";
import logo from "./assets/logo.jpeg";

function FormTab({ formType }) {
  const { lang, t } = useLanguage();
  const { config, loading, error } = useFormConfig(formType, lang);

  if (loading) return <Loader message={t("loadingForm")} />;
  if (error)
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  if (!config) return null;

  return <DynamicForm config={config} />;
}

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const { t, toggleLanguage } = useLanguage();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      {/* Responsive Top AppBar */}
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: "primary.main",
          backgroundImage: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 0.5, sm: 1 }, minHeight: { xs: 56, sm: 64 } }}>
          <Box
            component="img"
            src={logo}
            alt="Akanksha Agree Tech"
            sx={{
              height: { xs: 34, sm: 40 },
              width: { xs: 34, sm: 40 },
              borderRadius: "50%",
              mr: { xs: 1, sm: 1.5 },
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.8)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: { xs: "1.02rem", sm: "1.25rem" },
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t("appName")}
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<TranslateIcon sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }} />}
            onClick={toggleLanguage}
            sx={{
              textTransform: "none",
              borderColor: "rgba(255, 255, 255, 0.4)",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              px: { xs: 1.2, sm: 2 },
              py: { xs: 0.5, sm: 0.75 },
              fontSize: { xs: "0.82rem", sm: "0.9rem" },
              fontWeight: 600,
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            {t("languageLabel")}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Tabs for switching forms */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          top: { xs: 56, sm: 64 },
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: { xs: 48, sm: 54 },
            "& .MuiTab-root": {
              py: { xs: 1.2, sm: 1.8 },
              fontSize: { xs: "0.88rem", sm: "0.98rem" },
              fontWeight: 600,
              letterSpacing: "0.01em",
              transition: "all 0.2s",
            },
          }}
        >
          <Tab
            icon={<GrassIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" } }} />}
            iconPosition="start"
            label={t("farmerTab")}
          />
          <Tab
            icon={<EngineeringIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" } }} />}
            iconPosition="start"
            label={t("serviceProviderTab")}
          />
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3.5, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        {activeTab === 0 && <FormTab formType="farmer" />}
        {activeTab === 1 && <FormTab formType="service-provider" />}
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
