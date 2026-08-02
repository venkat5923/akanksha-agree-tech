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
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Box
            component="img"
            src={logo}
            alt="AgreeTech"
            sx={{ height: 36, width: 36, borderRadius: "50%", mr: 1.5, objectFit: "cover" }}
          />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            {t("appName")}
          </Typography>
          <Button
            color="inherit"
            startIcon={<TranslateIcon />}
            onClick={toggleLanguage}
            sx={{ textTransform: "none" }}
          >
            {t("languageLabel")}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": { py: 2 },
          }}
        >
          <Tab
            icon={<GrassIcon />}
            iconPosition="start"
            label={t("farmerTab")}
          />
          <Tab
            icon={<EngineeringIcon />}
            iconPosition="start"
            label={t("serviceProviderTab")}
          />
        </Tabs>
      </Box>

      <Box sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
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
