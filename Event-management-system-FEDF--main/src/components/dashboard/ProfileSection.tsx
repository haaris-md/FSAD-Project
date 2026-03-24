import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Building2, IdCard, Shield, Edit2, Save, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import * as localAuth from "@/lib/localAuth";

export default function ProfileSection() {
  const { toast } = useToast();
  const user = useUser();
  const session = localAuth.getSession();
  
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: session?.full_name || "",
    department: session?.department || "",
    student_id: session?.student_id || "",
  });

  const departments = ["CSE", "AI&DS", "ECE", "BCA"];

  function handleSave() {
    // In a real app, you'd update the user in localStorage
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
      
      // Update session
      const updatedSession = {
        ...session,
        full_name: form.full_name,
        department: form.department,
        student_id: form.student_id,
      };
      localStorage.setItem("cc_session", JSON.stringify(updatedSession));
      
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully" });
      setIsEditing(false);
      
      // Reload page to reflect changes
      setTimeout(() => window.location.reload(), 1000);
    }
  }

  function handleCancel() {
    setForm({
      full_name: session?.full_name || "",
      department: session?.department || "",
      student_id: session?.student_id || "",
    });
    setIsEditing(false);
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Profile Information</CardTitle>
              <CardDescription className="text-sm mt-1">View and manage your account details</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} style={{ background: "var(--gradient-primary)" }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Avatar */}
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
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

            {/* Full Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
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

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </Label>
              <div className="p-2 rounded-md bg-muted/50 text-sm">
                {session?.email}
              </div>
            </div>

            {/* Department */}
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

            {/* Student ID */}
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

            {/* Role (Read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                Role
              </Label>
              <div className="p-2 rounded-md bg-muted/50 text-sm capitalize">
                {session?.role || "student"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Events Registered</CardDescription>
            <CardTitle className="text-2xl">
              {(() => {
                try {
                  const events = JSON.parse(localStorage.getItem("cc_events_v2") || "[]");
                  return events.reduce((count: number, e: any) => 
                    count + (e.attendees?.filter((a: any) => a.user_id === session?.id).length || 0), 0
                  );
                } catch {
                  return 0;
                }
              })()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Events Organized</CardDescription>
            <CardTitle className="text-2xl">
              {(() => {
                try {
                  const events = JSON.parse(localStorage.getItem("cc_events_v2") || "[]");
                  return events.filter((e: any) => e.organizer_id === session?.id).length;
                } catch {
                  return 0;
                }
              })()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Account Status</CardDescription>
            <CardTitle className="text-2xl text-green-600">Active</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
