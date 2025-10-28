import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

export default function ExecDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Strategic overview and ROI metrics</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Average completion rate</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">In training programs</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Goals</CardTitle>
            <Target className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Objectives defined</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Training Effectiveness</CardTitle>
            <CardDescription>Performance metrics and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Quiz Performance</span>
                  <span className="text-sm font-medium">--</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-0"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Program Completion</span>
                  <span className="text-sm font-medium">--</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-0"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time to Competency</span>
                  <span className="text-sm font-medium">--</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Strategic Insights</CardTitle>
            <CardDescription>Key business impacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Employee Satisfaction</span>
              <span className="text-sm font-medium text-success">--</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Knowledge Retention</span>
              <span className="text-sm font-medium text-success">--</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Productivity Improvement</span>
              <span className="text-sm font-medium text-success">--</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Training metrics by team</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Department performance data will be displayed once training programs are active.</p>
        </CardContent>
      </Card>
    </div>
  );
}
