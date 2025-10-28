import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, ChevronDown } from "lucide-react";

type AppRole = "admin" | "hiring_manager" | "trainee" | "trainer" | "compliance" | "exec";

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  hiring_manager: "Hiring Manager",
  trainee: "Trainee / PM",
  trainer: "Trainer",
  compliance: "Compliance",
  exec: "Executive",
};

export default function DemoModeSwitcher() {
  const { demoMode, setDemoMode, signOut, user } = useAuth();

  const allRoles: AppRole[] = ["hiring_manager", "trainee", "trainer", "compliance", "exec", "admin"];

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 shadow-lg">
            <UserCircle className="h-4 w-4" />
            <span>{demoMode ? roleLabels[demoMode] : "Demo Mode"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch Persona</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allRoles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => setDemoMode(role)}
              className={demoMode === role ? "bg-accent" : ""}
            >
              {roleLabels[role]}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDemoMode(null)}>
            Reset to Actual Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="destructive" onClick={signOut} className="shadow-lg">
        Sign Out
      </Button>
    </div>
  );
}
