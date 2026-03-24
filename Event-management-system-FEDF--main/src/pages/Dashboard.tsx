import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, logout, changePassword } from "@/lib/localAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, User as UserIcon, Settings, Mail, Building2, IdCard, Shield, Sparkles, TrendingUp, Users, Calendar } from "lucide-react";
import EnhancedEventsSection from "@/components/dashboard/EnhancedEventsSection";
import UserManagement from "@/components/dashboard/UserManagement";
import EventGallery from "@/components/dashboard/EventGallery";
import Testimonials from "@/components/dashboard/Testimonials";
import NotificationCenter from "@/components/dashboard/NotificationCenter";

import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<{ id: string; email: string; full_name?: string; department?: string; student_id?: string; role?: string } | null>(null);
  const userCtx = useUser();
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    department: "",
    student_id: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const departments = ["CSE", "AI&DS", "ECE", "BCA"];

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate("/auth");
      return;
    }
    setSession(s);
    setForm({
      full_name: s.full_name || "",
      department: s.department || "",
      student_id: s.student_id || "",
    });
    setLoading(false);
  }, [navigate]);

  const handleSignOut = async () => {
    logout();
    navigate("/auth");
  };

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem("cc_users") || "{}");
    const email = session?.email || "";
    
    if (users[email]) {
      users[email] = {
        ...users[email],
        full_name: form.full_name,
        department: form.department,
        student_id: form.student_id,
      };
      localStorage.setItem("cc_users", JSON.stringify(users));
      
      const updatedSession = {
        ...session,
        full_name: form.full_name,
        department: form.department,
        student_id: form.student_id,
      };
      localStorage.setItem("cc_session", JSON.stringify(updatedSession));
      
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully" });
      setIsEditing(false);
      setProfileOpen(false);
      
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-foreground">Loading your dashboard...</p>
          <p className="mt-2 text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 animate-fade-in-down" style={{ boxShadow: "var(--shadow-md)" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Smart Campus
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Welcome, <span className="text-primary">{session?.full_name || session?.email}</span>
              </span>
            </div>
            {userCtx?.role && (
              <div className="flex items-center gap-4">
                <NotificationCenter />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md hover:scale-110 transition-transform animate-gradient">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden sm:inline font-medium">{session?.full_name || "User"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{session?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">Campus Hub</h2>
              <p className="text-muted-foreground mt-1">Manage your campus activities all in one place</p>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <TabsList className={`grid w-full max-w-2xl mb-6 ${(session?.role === "faculty" || session?.role === "admin") ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="home" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Building2 className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            {(session?.role === "faculty" || session?.role === "admin") && (
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="home" className="space-y-8">
            <Testimonials />
          </TabsContent>
          
          <TabsContent value="events">
            <EnhancedEventsSection userId={session?.id || ""} userRole={userCtx?.role} />
          </TabsContent>
          
          <TabsContent value="gallery">
            <EventGallery />
          </TabsContent>
          
          {(session?.role === "faculty" || session?.role === "admin") && (
            <TabsContent value="users">
              <UserManagement currentUserRole={session?.role} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-2xl animate-scale-in">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>View and update your profile information</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Profile Avatar */}
            <div className="flex items-center gap-4 pb-4 border-b animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-gradient">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{session?.full_name || "User"}</h3>
                <p className="text-sm text-muted-foreground">{session?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">{session?.role || "student"}</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input 
                    value={form.full_name} 
                    onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-2 rounded-md bg-muted/50 text-sm">
                    {session?.full_name || "Not set"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address
                </Label>
                <div className="p-2 rounded-md bg-muted/50 text-sm">
                  {session?.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Department
                </Label>
                {isEditing ? (
                  <Select value={form.department} onValueChange={(v) => setForm(f => ({ ...f, department: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 rounded-md bg-muted/50 text-sm">
                    {session?.department || "Not set"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-muted-foreground" />
                  Student ID
                </Label>
                {isEditing ? (
                  <Input 
                    value={form.student_id} 
                    onChange={(e) => setForm(f => ({ ...f, student_id: e.target.value }))}
                    placeholder="Enter your student ID"
                  />
                ) : (
                  <div className="p-2 rounded-md bg-muted/50 text-sm">
                    {session?.student_id || "Not set"}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div>
                <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                  Change Password
                </Button>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="hover:scale-105 transition-transform" style={{ background: "var(--gradient-primary)" }}>
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => {
                      setForm({
                        full_name: session?.full_name || "",
                        department: session?.department || "",
                        student_id: session?.student_id || "",
                      });
                      setIsEditing(false);
                    }} className="hover:scale-105 transition-transform">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="hover:scale-105 transition-transform" style={{ background: "var(--gradient-primary)" }}>
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
            {/* password change section */}
            {showPasswordForm && (
              <div className="mt-6 border-t pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h4 className="text-lg font-semibold mb-3">Change Password</h4>
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setShowPasswordForm(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }} className="mr-2">
                    Cancel
                  </Button>
                  <Button size="sm" style={{ background: "var(--gradient-primary)" }} onClick={() => {
                    if (!oldPassword || !newPassword || !confirmPassword) {
                      toast({ title: "Missing fields", description: "Please fill all password fields", variant: "destructive" });
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast({ title: "Mismatch", description: "New passwords do not match", variant: "destructive" });
                      return;
                    }
                    const email = session?.email || "";
                    const { error } = changePassword({ email, oldPassword, newPassword });
                    if (error) {
                      toast({ title: "Error", description: error, variant: "destructive" });
                    } else {
                      toast({ title: "Password updated", description: "Please log in again" });
                      logout();
                      navigate("/auth");
                    }
                  }}>
                    Update
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      {/* Chatbot Widget */}

    </div>
  );
};

export default Dashboard;

