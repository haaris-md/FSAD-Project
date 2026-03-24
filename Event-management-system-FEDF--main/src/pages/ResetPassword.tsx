import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "@/lib/localAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const query = useQuery();

  useEffect(() => {
    const t = query.get("token") || "";
    setToken(t);
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Missing token", description: "There is no reset token provided", variant: "destructive" });
      return;
    }
    if (!password || !confirm) {
      toast({ title: "Missing fields", description: "Please fill both password fields", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Mismatch", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = resetPassword(token, password);
    setLoading(false);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Password changed", description: "You can now log in with your new password" });
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-lg" style={{ boxShadow: "var(--shadow-lg)" }}>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Provide a new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Token</Label>
                <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="paste reset token" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset"}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-sm text-center">
              <Link to="/auth" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
