import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            PeriMeter Training
          </h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise Training Platform for Product Managers
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-lg border border-primary/20 bg-card shadow-sm hover:shadow-md transition-all">
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rich Content</h3>
            <p className="text-muted-foreground">
              Access documents, videos, and resources with intelligent search
            </p>
          </div>

          <div className="p-6 rounded-lg border border-primary/20 bg-card shadow-sm hover:shadow-md transition-all">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Team Management</h3>
            <p className="text-muted-foreground">
              Manage trainees, assign objectives, and track progress
            </p>
          </div>

          <div className="p-6 rounded-lg border border-primary/20 bg-card shadow-sm hover:shadow-md transition-all">
            <Trophy className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Micro Assessments</h3>
            <p className="text-muted-foreground">
              AI-powered quizzes to reinforce learning and track mastery
            </p>
          </div>

          <div className="p-6 rounded-lg border border-primary/20 bg-card shadow-sm hover:shadow-md transition-all">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compliance Ready</h3>
            <p className="text-muted-foreground">
              Built-in monitoring for enterprise security standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
