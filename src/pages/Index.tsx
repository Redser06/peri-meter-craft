import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-6 py-20 lg:py-28">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            PeriMeter Training
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Enterprise Training Platform for Product Managers
          </p>
          <div className="pt-2">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-base px-8 py-5 font-medium hover:bg-primary/90 transition-colors">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-2">Rich Content</h3>
            <p className="text-sm text-muted-foreground">
              Access documents, videos, and resources with intelligent search
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-2">Team Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage trainees, assign objectives, and track progress
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <Trophy className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-2">Micro Assessments</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered quizzes to reinforce learning and track mastery
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-2">Compliance Ready</h3>
            <p className="text-sm text-muted-foreground">
              Built-in monitoring for enterprise security standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
