import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  department?: string;
  image: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    role: "Principal",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    quote: "Our Smart Campus platform has revolutionized how we manage events and student engagement. The seamless integration of technology with campus activities has created an environment where students can truly thrive and showcase their talents.",
    rating: 5,
  },
  {
    id: "2",
    name: "Prof. Anita Sharma",
    role: "Head of Department",
    department: "Computer Science",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    quote: "The event management system has made organizing technical fests and workshops incredibly efficient. The certificate generation feature saves us hours of manual work, and students love the instant digital certificates.",
    rating: 5,
  },
  {
    id: "3",
    name: "Dr. Vikram Singh",
    role: "Dean of Students",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    quote: "Student participation has increased by 40% since we implemented this platform. The user-friendly interface and real-time notifications keep everyone informed and engaged. It's truly a game-changer for campus life.",
    rating: 5,
  },
  {
    id: "4",
    name: "Prof. Meera Patel",
    role: "Faculty Coordinator",
    department: "Cultural Activities",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    quote: "Managing cultural events has never been easier. From registration to attendance tracking to certificate issuance - everything is streamlined. The platform has helped us reach more students and organize better events.",
    rating: 5,
  },
  {
    id: "5",
    name: "Dr. Arjun Reddy",
    role: "Assistant Professor",
    department: "AI & Data Science",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    quote: "The analytics and tracking features provide valuable insights into student participation patterns. This data helps us design better programs and ensure maximum student engagement across all departments.",
    rating: 5,
  },
  {
    id: "6",
    name: "Prof. Priya Desai",
    role: "Sports Coordinator",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
    quote: "Organizing sports tournaments has become so much more efficient. The team registration feature and attendance tracking help us manage large-scale events with ease. Students appreciate the transparency and quick updates.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          What Our Faculty Says
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hear from our distinguished faculty members and administrators about their experience with Smart Campus
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-6 space-y-4">
              {/* Quote Icon */}
              <div className="flex justify-between items-start">
                <Quote className="w-8 h-8 text-primary/20" />
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Avatar className="w-12 h-12 ring-2 ring-primary/10">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  {testimonial.department && (
                    <div className="text-xs text-primary">{testimonial.department}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-4 mt-8">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">95%</div>
            <div className="text-sm text-muted-foreground mt-1">Faculty Satisfaction</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">500+</div>
            <div className="text-sm text-muted-foreground mt-1">Events Organized</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">10K+</div>
            <div className="text-sm text-muted-foreground mt-1">Students Engaged</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">8K+</div>
            <div className="text-sm text-muted-foreground mt-1">Certificates Issued</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
