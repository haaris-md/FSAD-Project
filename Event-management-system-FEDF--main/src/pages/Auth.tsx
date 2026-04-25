import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getSession, login, loginWithStudentId, register, getUserByEmail } from "@/lib/localAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Loader2, Shield, Mail, AlertCircle, Database } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");
  const [signInMode, setSignInMode] = useState<"email"|"student">("email");

  useEffect(() => {
    const session = getSession();
    if (session) navigate("/dashboard");
  }, [navigate]);

  // Email validation helper
  const validateEmail = (email: string, selectedRole: string): { valid: boolean; message?: string } => {
    const isKlhEmail = email.toLowerCase().endsWith("@klh.edu.in");
    
    if (selectedRole === "student") {
      if (!isKlhEmail) {
        return { 
          valid: false, 
          message: "Students must use their college email (@klh.edu.in)" 
        };
      }
    }
    
    return { valid: true };
  };

  // Local Email/Password Sign-Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!email || !password || !fullName || !role) {
      toast({ 
        title: "Missing fields", 
        description: "Please fill in all required fields", 
        variant: "destructive" 
      });
      return;
    }
    
    // Validate email based on role
    const emailValidation = validateEmail(email, role);
    if (!emailValidation.valid) {
      toast({ 
        title: "Invalid email", 
        description: emailValidation.message, 
        variant: "destructive" 
      });
      return;
    }
    
    // For students, require department and student ID
    if (role === "student" && (!department || !studentId)) {
      toast({ 
        title: "Missing student information", 
        description: "Students must provide department and student ID", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    const { error } = register({ 
      email, 
      password, 
      full_name: fullName, 
      department, 
      student_id: studentId, 
      role,
    });
    setLoading(false);
    
    if (error) {
      toast({ title: "Sign up failed", description: error, variant: "destructive" });
    } else {
      toast({ 
        title: "Account created!", 
        description: `Welcome to Smart Campus, ${fullName}!` 
      });
      navigate("/dashboard");
    }
  };

  // Local Email/Password Sign-In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signInMode === "email") {
      if (!email || !password) {
        toast({ 
          title: "Missing fields", 
          description: "Please enter email and password", 
          variant: "destructive" 
        });
        return;
      }
      
      // Check if user exists and validate email for students
      const existing = getUserByEmail(email);
      if (existing?.role === "student" && !email.toLowerCase().endsWith("@klh.edu.in")) {
        toast({ 
          title: "Invalid email", 
          description: "Students must sign in with their @klh.edu.in email", 
          variant: "destructive" 
        });
        return;
      }
    } else {
      if (!studentId || !password) {
        toast({ 
          title: "Missing fields", 
          description: "Please enter student ID and password", 
          variant: "destructive" 
        });
        return;
      }
    }
    
    setLoading(true);
    const { error } = signInMode === "email" 
      ? login({ email, password }) 
      : loginWithStudentId({ student_id: studentId, password });
    setLoading(false);
    
    if (error) {
      toast({ title: "Sign in failed", description: error, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Smart Campus</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your campus hub</p>
        </div>

        <Card className="shadow-lg" style={{ boxShadow: "var(--shadow-lg)" }}>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Sign in or create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign-In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Login With</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button type="button" variant={signInMode==='email'?'default':'outline'} onClick={()=>setSignInMode('email')}>Email</Button>
                      <Button type="button" variant={signInMode==='student'?'default':'outline'} onClick={()=>setSignInMode('student')}>Student ID</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {signInMode === 'email' ? (
                      <>
                        <Label htmlFor="signin-email">Email</Label>
                        <Input id="signin-email" type="email" placeholder="xxxxx@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </>
                    ) : (
                      <>
                        <Label htmlFor="signin-student">Student ID</Label>
                        <Input id="signin-student" type="text" placeholder="24100*****" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                      </>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="flex justify-between items-center">
                    <Link to="/auth/forgot" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                    <Button type="submit" disabled={loading} style={{ background: "var(--gradient-primary)" }}>
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Sign-Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Role Selection - First */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Role *
                    </Label>
                    <Select value={role} onValueChange={(value) => {
                      setRole(value);
                      // Clear student-specific fields if not student
                      if (value !== "student") {
                        setStudentId("");
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="faculty">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Faculty
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Email Validation Alert */}
                  {role === "student" && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 text-sm">
                        Students must use their college email: <strong>@klh.edu.in</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name *</Label>
                    <Input 
                      id="signup-name" 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email *
                    </Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder={role === "student" ? "yourname@klh.edu.in" : "your.email@example.com"}
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                    {role === "student" && email && !email.toLowerCase().endsWith("@klh.edu.in") && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Must be a @klh.edu.in email
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                  </div>

                  {/* Student-specific fields */}
                  {role === "student" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select value={department} onValueChange={setDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                            <SelectItem value="AI&DS">AI & Data Science</SelectItem>
                            <SelectItem value="ECE">Electronics & Communication</SelectItem>
                            <SelectItem value="BCA">Bachelor of Computer Applications</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-student-id">Student ID *</Label>
                        <Input 
                          id="signup-student-id" 
                          type="text" 
                          placeholder="24100*****" 
                          value={studentId} 
                          onChange={(e) => setStudentId(e.target.value)} 
                        />
                      </div>
                    </>
                  )}

                  {/* Faculty/Admin optional fields */}
                  {(role === "faculty" || role === "admin") && (
                    <div className="space-y-2">
                      <Label htmlFor="department">Department (Optional)</Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                          <SelectItem value="AI&DS">AI & Data Science</SelectItem>
                          <SelectItem value="ECE">Electronics & Communication</SelectItem>
                          <SelectItem value="BCA">Bachelor of Computer Applications</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading} 
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Clear Storage Link */}
        <div className="mt-6 text-center">
          <Link to="/clear-storage">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Database className="w-4 h-4" />
              Manage Local Storage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
