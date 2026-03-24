import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Building2, 
  IdCard, 
  Shield, 
  Calendar, 
  Users, 
  Award,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText
} from "lucide-react";
import { getUserActivity, getUserEventStats } from "@/lib/userActivityTracker";
import type { LocalUser } from "@/lib/localAuth";

interface UserDetailsDialogProps {
  user: LocalUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailsDialog = ({ user, open, onOpenChange }: UserDetailsDialogProps) => {
  const [activity, setActivity] = useState<ReturnType<typeof getUserActivity>>(null);
  const [stats, setStats] = useState<ReturnType<typeof getUserEventStats>>(null);

  useEffect(() => {
    if (user) {
      const userActivity = getUserActivity(user.id);
      const userStats = getUserEventStats(user.id);
      setActivity(userActivity);
      setStats(userStats);
    }
  }, [user]);

  if (!user) return null;

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "faculty":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "admin":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      registered: "bg-blue-100 text-blue-700",
      waitlisted: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-green-100 text-green-700",
      upcoming: "bg-purple-100 text-purple-700",
      ongoing: "bg-orange-100 text-orange-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile & Activity</DialogTitle>
          <DialogDescription>Complete information and event history</DialogDescription>
        </DialogHeader>

        {/* User Header */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">
              {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{user.full_name || "No Name"}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getRoleBadgeColor(user.role)}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role || "student"}
              </Badge>
              {user.department && (
                <Badge variant="outline">
                  <Building2 className="w-3 h-3 mr-1" />
                  {user.department}
                </Badge>
              )}
              {user.student_id && (
                <Badge variant="outline">
                  <IdCard className="w-3 h-3 mr-1" />
                  {user.student_id}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="created">Created Events</TabsTrigger>
            <TabsTrigger value="participated">Participated</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-2xl font-bold">{stats?.created || 0}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Participated</p>
                      <p className="text-2xl font-bold">{stats?.participated || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{stats?.completed || 0}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Completion</p>
                      <p className="text-2xl font-bold">{stats?.completionRate || 0}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Total Events</span>
                  <span className="font-semibold">{stats?.totalEvents || 0}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Events Organized</span>
                  <span className="font-semibold">{stats?.created || 0}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Events Attended</span>
                  <span className="font-semibold">{stats?.completed || 0}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Volunteered</span>
                  <span className="font-semibold">{stats?.volunteered || 0}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Created Events Tab */}
          <TabsContent value="created" className="space-y-4">
            {activity?.createdEvents && activity.createdEvents.length > 0 ? (
              <div className="space-y-3">
                {activity.createdEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.attendees} attendees
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusBadge(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events created yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Participated Events Tab */}
          <TabsContent value="participated" className="space-y-4">
            {activity?.participatedEvents && activity.participatedEvents.length > 0 ? (
              <div className="space-y-3">
                {activity.participatedEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            {event.registrationType === "team" && event.teamName && (
                              <Badge variant="outline" className="text-xs">
                                Team: {event.teamName}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            {event.present !== undefined && (
                              <span className="flex items-center gap-1">
                                {event.present ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600">Attended</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-red-600">Absent</span>
                                  </>
                                )}
                              </span>
                            )}
                            {event.certificateIssued && (
                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span className="text-yellow-600">Certificate Issued</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusBadge(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events participated yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">{user.full_name || "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role || "student"}</p>
                    </div>
                  </div>

                  {user.department && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                  )}

                  {user.student_id && (
                    <div className="flex items-start gap-3">
                      <IdCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Student ID</p>
                        <p className="text-sm text-muted-foreground font-mono">{user.student_id}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-sm text-muted-foreground font-mono text-xs">{user.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
