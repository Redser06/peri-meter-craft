import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import HiringManagerDashboard from "@/components/dashboards/HiringManagerDashboard";
import TraineeDashboard from "@/components/dashboards/TraineeDashboard";
import TrainerDashboard from "@/components/dashboards/TrainerDashboard";
import ComplianceDashboard from "@/components/dashboards/ComplianceDashboard";
import ExecDashboard from "@/components/dashboards/ExecDashboard";
import DemoModeSwitcher from "@/components/DemoModeSwitcher";

export default function Dashboard() {
  const { user, loading, roles, demoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Determine which dashboard to show based on demo mode or actual roles
  const activeRole = demoMode || roles[0];

  const renderDashboard = () => {
    switch (activeRole) {
      case "hiring_manager":
        return <HiringManagerDashboard />;
      case "trainee":
        return <TraineeDashboard />;
      case "trainer":
        return <TrainerDashboard />;
      case "compliance":
        return <ComplianceDashboard />;
      case "exec":
        return <ExecDashboard />;
      case "admin":
        return <HiringManagerDashboard />; // Admins see hiring manager view by default
      default:
        return <TraineeDashboard />; // Default to trainee view
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoModeSwitcher />
      {renderDashboard()}
    </div>
  );
}
