import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Users, 
  User,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  FileText,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { getEventParticipants } from "@/lib/userActivityTracker";
import { markCertificateIssued } from "@/lib/eventsStore";
import type { EventItem } from "@/lib/eventsStore";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface EventDetailsDialogProps {
  event: EventItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: string;
  onEdit?: (event: EventItem) => void;
  onDelete?: (eventId: string) => void;
}

const EventDetailsDialog = ({ event, open, onOpenChange, userRole, onEdit, onDelete }: EventDetailsDialogProps) => {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<ReturnType<typeof getEventParticipants>>([]);
  const canManage = userRole === "faculty" || userRole === "admin";

  useEffect(() => {
    if (event) {
      const parts = getEventParticipants(event.id);
      setParticipants(parts);
    }
  }, [event]);

  if (!event) return null;

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

  const generateCertificate = (participant: typeof participants[0]) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Background
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, 297, 210, "F");

    // Border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 267, 180);

    // Title
    doc.setFontSize(40);
    doc.setTextColor(59, 130, 246);
    doc.text("Certificate of Participation", 148.5, 50, { align: "center" });

    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", 148.5, 70, { align: "center" });

    // Participant name
    doc.setFontSize(28);
    doc.setTextColor(30, 30, 30);
    doc.text(participant.userName, 148.5, 90, { align: "center" });

    // Event details
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("has successfully participated in", 148.5, 105, { align: "center" });

    // Event name
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246);
    doc.text(event.title, 148.5, 120, { align: "center" });

    // Date and location
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Held on ${eventDate} at ${event.location}`, 148.5, 135, { align: "center" });

    // Department
    if (participant.department) {
      doc.text(`Department: ${participant.department}`, 148.5, 145, { align: "center" });
    }

    // Issue date
    doc.setFontSize(10);
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 148.5, 175, { align: "center" });

    // Signature line
    doc.setLineWidth(0.5);
    doc.setDrawColor(100, 100, 100);
    doc.line(40, 165, 90, 165);
    doc.line(207, 165, 257, 165);

    doc.setFontSize(10);
    doc.text("Organizer Signature", 65, 172, { align: "center" });
    doc.text("Institution Seal", 232, 172, { align: "center" });

    // Save
    doc.save(`Certificate_${participant.userName}_${event.title}.pdf`);

    // Mark as issued
    markCertificateIssued(participant.registrationId);
    toast({
      title: "Certificate Generated",
      description: `Certificate issued to ${participant.userName}`,
    });

    // Refresh participants
    setTimeout(() => {
      const parts = getEventParticipants(event.id);
      setParticipants(parts);
    }, 100);
  };

  const attendedCount = participants.filter(p => p.present).length;
  const registeredCount = participants.length;
  const certificatesIssued = participants.filter(p => p.certificateIssued).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Complete event information and participant management
              </DialogDescription>
            </div>
            {canManage && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(event)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Delete event "${event.title}"?`)) {
                      onDelete?.(event.id);
                      onOpenChange(false);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Event Poster */}
        {event.poster_data_url && (
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img
              src={event.poster_data_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">
              Participants ({registeredCount})
            </TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.event_date).toLocaleString("en-US", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge className={getStatusBadge(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>

                  {event.department && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm text-muted-foreground">{event.department}</p>
                      </div>
                    </div>
                  )}

                  {event.club && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Club</p>
                        <p className="text-sm text-muted-foreground">{event.club}</p>
                      </div>
                    </div>
                  )}

                  {event.max_attendees && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Max Attendees</p>
                        <p className="text-sm text-muted-foreground">{event.max_attendees}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Organizer</p>
                      <p className="text-sm text-muted-foreground">
                        {event.organizer_name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-4">
            {participants.length > 0 ? (
              <div className="space-y-3">
                {participants.map((participant) => (
                  <Card key={participant.registrationId}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{participant.userName}</h4>
                            {participant.type === "team" && participant.teamName && (
                              <Badge variant="outline" className="text-xs">
                                Team: {participant.teamName}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{participant.userEmail}</span>
                            {participant.department && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {participant.department}
                              </span>
                            )}
                            {participant.studentId && (
                              <span className="font-mono text-xs">
                                {participant.studentId}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={getStatusBadge(participant.status)}>
                              {participant.status}
                            </Badge>
                            {participant.present !== undefined && (
                              <span className="flex items-center gap-1 text-sm">
                                {participant.present ? (
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
                            {participant.certificateIssued && (
                              <span className="flex items-center gap-1 text-sm">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span className="text-yellow-600">Certificate Issued</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {canManage && participant.present && !participant.certificateIssued && (
                          <Button
                            size="sm"
                            onClick={() => generateCertificate(participant)}
                            className="gap-2"
                          >
                            <Award className="w-4 h-4" />
                            Issue Certificate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No participants registered yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Registered</p>
                      <p className="text-2xl font-bold">{registeredCount}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Attended</p>
                      <p className="text-2xl font-bold">{attendedCount}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Certificates</p>
                      <p className="text-2xl font-bold">{certificatesIssued}</p>
                    </div>
                    <Award className="w-8 h-8 text-yellow-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-2xl font-bold">
                        {registeredCount > 0
                          ? Math.round((attendedCount / registeredCount) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(
                    participants.reduce((acc, p) => {
                      const dept = p.department || "Unknown";
                      if (!acc.has(dept)) acc.set(dept, 0);
                      acc.set(dept, acc.get(dept)! + 1);
                      return acc;
                    }, new Map<string, number>())
                  ).map(([dept, count]) => (
                    <div key={dept} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">{dept}</span>
                      <Badge variant="secondary">{count} participants</Badge>
                    </div>
                  ))}
                  {participants.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
