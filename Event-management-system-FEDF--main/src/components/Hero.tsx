import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Calendar, 
  Search, 
  MessageSquare, 
  Users, 
  Bell,
  Sparkles,
  Shield,
  Zap,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Heart,
  Target,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const Hero = () => {
  const features = [
    { 
      icon: Calendar, 
      label: "Smart Events", 
      description: "Discover, register, and manage campus events with QR attendance",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: Shield, 
      label: "Secure Access", 
      description: "Role-based authentication with student ID verification",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Users, 
      label: "Club Management", 
      description: "Join clubs, track activities, and connect with peers",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: Award, 
      label: "Certificates", 
      description: "Automatic PDF certificate generation for attended events",
      color: "from-orange-500 to-red-500"
    },
    { 
      icon: TrendingUp, 
      label: "Analytics", 
      description: "Department-wise statistics and attendance tracking",
      color: "from-indigo-500 to-blue-500"
    },
    { 
      icon: Zap, 
      label: "Real-time Updates", 
      description: "Instant notifications and live event updates",
      color: "from-yellow-500 to-orange-500"
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CSE Student",
      content: "Campus Connect has made managing events so much easier. The QR attendance feature is a game-changer!",
      rating: 5
    },
    {
      name: "Rahul Kumar",
      role: "Club President",
      content: "As a club organizer, this platform helps me reach more students and manage registrations effortlessly.",
      rating: 5
    },
    {
      name: "Dr. Anita Desai",
      role: "Faculty Advisor",
      content: "The approval workflow and analytics features provide excellent oversight of campus activities.",
      rating: 5
    },
  ];

  const benefits = [
    { icon: CheckCircle2, text: "Streamlined event registration" },
    { icon: CheckCircle2, text: "QR-based attendance tracking" },
    { icon: CheckCircle2, text: "Automated certificate generation" },
    { icon: CheckCircle2, text: "Department-wise analytics" },
    { icon: CheckCircle2, text: "Faculty approval workflow" },
    { icon: CheckCircle2, text: "Real-time notifications" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-3 rounded-full mb-8 animate-bounce-in border border-primary/20 hover-glow">
            <Sparkles className="w-5 h-5 text-primary animate-wiggle" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Smart Campus Hub</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Your Campus,
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent animate-gradient">
              Reimagined
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            The ultimate platform for modern campus life. Seamlessly manage events, track attendance with QR codes, generate certificates, and stay connected with your entire campus community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-10 py-7 shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 group" style={{ background: "var(--gradient-primary)" }}>
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 hover:bg-primary/5 transition-all hover:scale-105">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Quick Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border hover-lift animate-scale-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <benefit.icon className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="zoom-in">
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="secondary">
                <Rocket className="w-3 h-3 mr-1 animate-wiggle" />
                Powerful Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need for
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient"> Campus Success</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools designed specifically for modern educational institutions
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={feature.label}
                animation="reveal"
                delay={index * 100}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none bg-card/80 backdrop-blur-sm hover-lift overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <feature.icon className="w-7 h-7 text-white group-hover:animate-pulse" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.label}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Users, value: "2,500+", label: "Active Students", color: "text-blue-500" },
              { icon: Calendar, value: "150+", label: "Events Hosted", color: "text-purple-500" },
              { icon: Award, value: "1,200+", label: "Certificates Issued", color: "text-green-500" },
              { icon: Heart, value: "98%", label: "Satisfaction Rate", color: "text-red-500" },
            ].map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                animation="zoom-in"
                delay={index * 150}
              >
                <Card className="text-center p-8 border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover-lift bg-card/80 backdrop-blur-sm group h-full">
                  <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-4 group-hover:scale-125 transition-transform duration-300`} />
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-gradient">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">{stat.label}</div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="fade-in">
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="secondary">
                <Star className="w-3 h-3 mr-1 animate-heartbeat" />
                Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Loved by
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient"> Students & Faculty</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what our community has to say about Campus Connect
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal
                key={testimonial.name}
                animation={index % 2 === 0 ? "slide-left" : "slide-right"}
                delay={index * 150}
              >
                <Card className="border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 hover-lift bg-card/80 backdrop-blur-sm group h-full">
                  <CardHeader>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-125 transition-transform" style={{ transitionDelay: `${i * 0.05}s` }} />
                      ))}
                    </div>
                    <CardDescription className="text-base italic group-hover:text-foreground transition-colors">"{testimonial.content}"</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform animate-gradient">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold group-hover:text-primary transition-colors">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="flip-in">
            <Card className="max-w-4xl mx-auto border-none shadow-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm hover-glow">
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-6 text-primary animate-wiggle" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Transform Your
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient"> Campus Experience?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of students and faculty already using Campus Connect to streamline their campus activities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth">
                    <Button size="lg" className="text-lg px-10 py-7 shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 group hover-glow" style={{ background: "var(--gradient-primary)" }}>
                      Start Your Journey
                      <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 animate-fade-in-left">
              <GraduationCap className="w-8 h-8 text-primary animate-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient">
                Campus Connect
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>KL University</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>24/7 Support</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground animate-fade-in-right">
              © 2025 Campus Connect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
