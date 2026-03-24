import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, X } from "lucide-react";

interface GalleryEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  attendees: number;
  images: string[];
  description: string;
}

const pastEvents: GalleryEvent[] = [
  {
    id: "1",
    title: "Tech Fest 2024",
    date: "October 15, 2024",
    location: "Main Auditorium",
    category: "Technical",
    attendees: 450,
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
    ],
    description: "Annual technical festival featuring coding competitions, tech talks, and innovation showcases."
  },
  {
    id: "2",
    title: "Cultural Night 2024",
    date: "September 28, 2024",
    location: "Open Air Theatre",
    category: "Cultural",
    attendees: 600,
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop",
    ],
    description: "A vibrant celebration of diverse cultures with music, dance, and traditional performances."
  },
  {
    id: "3",
    title: "Sports Championship",
    date: "August 20, 2024",
    location: "Sports Complex",
    category: "Sports",
    attendees: 350,
    images: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
    ],
    description: "Inter-department sports tournament featuring cricket, football, basketball, and athletics."
  },
  {
    id: "4",
    title: "Hackathon 2024",
    date: "July 10, 2024",
    location: "Innovation Lab",
    category: "Technical",
    attendees: 200,
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
    ],
    description: "24-hour coding marathon where students built innovative solutions to real-world problems."
  },
  {
    id: "5",
    title: "Annual Day Celebration",
    date: "June 5, 2024",
    location: "Main Campus",
    category: "Cultural",
    attendees: 800,
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop",
    ],
    description: "Grand annual day celebration with awards ceremony, cultural programs, and alumni meet."
  },
  {
    id: "6",
    title: "Workshop on AI & ML",
    date: "May 15, 2024",
    location: "Seminar Hall",
    category: "Academic",
    attendees: 150,
    images: [
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
    ],
    description: "Intensive workshop on Artificial Intelligence and Machine Learning with industry experts."
  },
];

export default function EventGallery() {
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technical: "bg-blue-500",
      Cultural: "bg-purple-500",
      Sports: "bg-green-500",
      Academic: "bg-orange-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Event Gallery</CardTitle>
          <CardDescription>Highlights from our past events and celebrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-lg border bg-card cursor-pointer transition-all hover:shadow-lg"
                onClick={() => {
                  setSelectedEvent(event);
                  setSelectedImageIndex(0);
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className={`absolute top-3 right-3 ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs mt-1 opacity-90">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex gap-1 mt-3">
                    {event.images.slice(0, 3).map((_, idx) => (
                      <div key={idx} className="h-1 flex-1 bg-primary/20 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: idx === 0 ? '100%' : '0%' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
                <img
                  src={selectedEvent.images[selectedImageIndex]}
                  alt={`${selectedEvent.title} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-2">
                {selectedEvent.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getCategoryColor(selectedEvent.category)}>{selectedEvent.category}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedEvent.date}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedEvent.location}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Users className="w-3 h-3" />
                    {selectedEvent.attendees} Attendees
                  </Badge>
                </div>
                <p className="text-muted-foreground">{selectedEvent.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
