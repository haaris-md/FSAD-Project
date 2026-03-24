import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset } from "@/lib/localAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = requestPasswordReset(email);
    setLoading(false);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Reset token generated", description: "Use the token shown below or copy/paste from the notification", variant: "default" });
      setToken(res.token || "");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-lg" style={{ boxShadow: "var(--shadow-lg)" }}>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a reset token</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fp-email">Email</Label>
                <Input
                  id="fp-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Token"}
                </Button>
              </div>
            </form>
            {token && (
              <div className="mt-6 p-4 bg-muted rounded">
                <p className="text-sm font-medium">Reset Token (copy it):</p>
                <pre className="break-words text-xs bg-white p-2 rounded">{token}</pre>
                <div className="mt-2 text-right">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/auth/reset?token=${token}`)}>
                    Use Token
                  </Button>
                </div>
              </div>
            )}
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

export default ForgotPassword;
