import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAllUsers, getAllUsers } from "@/lib/localAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Trash2, Database, Users, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const ClearStorage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState(getAllUsers());
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearAll = () => {
    clearAllUsers();
    setUsers({});
    setShowConfirm(false);
    toast({
      title: "Storage Cleared",
      description: "All users have been removed from local storage",
    });
    setTimeout(() => navigate("/auth"), 1500);
  };

  const userCount = Object.keys(users).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-2xl animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Auth
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Local Storage Manager</CardTitle>
                <CardDescription>Manage user data in local storage</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Count */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Total Users</p>
                  <p className="text-sm text-muted-foreground">Stored in local storage</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">{userCount}</div>
            </div>

            {/* User List */}
            {userCount > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">Registered Users:</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 p-4 rounded-lg bg-muted/30">
                  {Object.values(users).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-md bg-card border"
                    >
                      <div>
                        <p className="font-medium">{user.full_name || "No Name"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                            {user.role || "student"}
                          </span>
                          {user.department && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                              {user.department}
                            </span>
                          )}
                        </div>
                      </div>
                      {user.student_id && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Student ID</p>
                          <p className="text-sm font-mono">{user.student_id}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Alert */}
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Warning:</strong> This action will permanently delete all user accounts
                and sessions from local storage. This cannot be undone.
              </AlertDescription>
            </Alert>

            {/* Clear Button */}
            {!showConfirm ? (
              <Button
                onClick={() => setShowConfirm(true)}
                variant="destructive"
                className="w-full gap-2"
                disabled={userCount === 0}
              >
                <Trash2 className="w-4 h-4" />
                Clear All Users ({userCount})
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-center text-sm font-medium">
                  Are you sure you want to delete all {userCount} user(s)?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleClearAll} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete All
                  </Button>
                </div>
              </div>
            )}

            {userCount === 0 && (
              <div className="text-center py-8">
                <Database className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No users in local storage</p>
                <Button
                  onClick={() => navigate("/auth")}
                  variant="outline"
                  className="mt-4"
                >
                  Go to Sign Up
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClearStorage;
