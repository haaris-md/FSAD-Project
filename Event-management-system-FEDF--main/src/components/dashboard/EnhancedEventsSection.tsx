import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon, Check, X, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import * as store from "@/lib/eventsStore";
import { useUser } from "@/context/UserContext";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import EventDetailsDialog from "./EventDetailsDialog";

const PAGE_SIZE = 6;

export default function EnhancedEventsSection({ userId, userRole }: { userId: string; userRole?: string }) {
  const { toast } = useToast();
  const user = useUser();

  // Data
  const [items, setItems] = useState<store.EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [onlyUpcoming, setOnlyUpcoming] = useState(true);
  const [page, setPage] = useState(1);
  const [filterDept, setFilterDept] = useState<string | null>(null);
  const [filterClub, setFilterClub] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<store.EventItem | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Creator dialog
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    event_date: "",
    max_attendees: "",
    poster_data_url: "",
    department: "",
    club: "",
    isFeatured: false,
  });

  const canCreate = userRole === "faculty" || userRole === "admin";
  const isApprover = canCreate;
  const departments = ["CSE", "AI&DS", "ECE", "BCA"];
  const [clubs, setClubs] = useState<Array<{ id: string; name: string }>>([]);

  const load = () => setItems(store.getAll());

  useEffect(() => {
    load();
    try {
      const raw = localStorage.getItem("cc_clubs");
      const list = raw ? JSON.parse(raw) as Array<any> : [];
      setClubs(list.map((c:any)=>({ id: c.id, name: c.name })));
    } catch {}
  }, []);

  const upcoming = useMemo(() => store.upcoming(items), [items]);

  const filtered = useMemo(() => {
    let base = store.search(items, search, category, onlyUpcoming);
    if (filterDept) base = base.filter(e => (e.department || "") === filterDept);
    if (filterClub) base = base.filter(e => (e.club || "") === filterClub);
    // Students should only see approved events
    if (!isApprover) base = base.filter(e => e.approvalStatus === "approved");
    return base;
  }, [items, search, category, onlyUpcoming, filterDept, filterClub, isApprover]);
  const pagedResult = useMemo(() => store.paginate(filtered, page, PAGE_SIZE), [filtered, page]);
  const paged = pagedResult.data;

  function resetForm() {
    setEditingId(null);
    setForm({ title: "", description: "", category: "", location: "", event_date: "", max_attendees: "", poster_data_url: "", department: "", club: "", isFeatured: false });
  }

  function startEdit(e: store.EventItem) {
    setEditingId(e.id);
    setForm({
      title: e.title,
      description: e.description,
      category: e.category,
      location: e.location,
      event_date: e.event_date.slice(0,16),
      max_attendees: String(e.max_attendees || ""),
      poster_data_url: e.poster_data_url || "",
      department: e.department || "",
      club: e.club || "",
      isFeatured: e.isFeatured || false,
    });
    setOpen(true);
  }

  function onPosterChange(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, poster_data_url: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      event_date: new Date(form.event_date).toISOString(),
      status: "upcoming" as const,
      max_attendees: form.max_attendees ? Number(form.max_attendees) : undefined,
      organizer_id: userId,
      organizer_name: user?.full_name || user?.email || "Organizer",
      poster_data_url: form.poster_data_url || undefined,
      department: form.department || null,
      club: form.club || null,
      isFeatured: form.isFeatured,
    };
    if (editingId) {
      store.update(editingId, payload);
      toast({ title: "Updated", description: "Event updated successfully" });
    } else {
      store.create(payload);
      toast({ title: "Created", description: "Event created successfully" });
    }
    setOpen(false);
    resetForm();
    load();
  }

  function remove(id: string) {
    store.remove(id);
    toast({ title: "Deleted", description: "Event deleted" });
    load();
  }

  function registerIndividual(eventId: string) {
    const r = store.registerIndividual(eventId, userId, (user as any)?.department || null);
    if (r) toast({ title: "Registered", description: `Status: ${r.status}` });
    load();
  }

  function registerTeam(eventId: string, teamName: string, members: number) {
    const r = store.registerTeam(eventId, userId, teamName, members, (user as any)?.department || null);
    if (r) toast({ title: "Registered (Team)", description: `Status: ${r.status}` });
    load();
  }

  const organizerEvents = useMemo(() => store.getUserEvents(userId), [items, userId]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="grid gap-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
              <Badge variant="secondary" className="text-xs">{upcoming.length} events</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcoming.slice(0, 3).map(e => (
                <div 
                  key={e.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(e);
                    setDetailsDialogOpen(true);
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm line-clamp-1">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(e.event_date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
              {upcoming.length === 0 && <div className="text-sm text-muted-foreground py-4">No upcoming events</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Events Section */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">All Events</CardTitle>
              <CardDescription className="text-sm mt-1">Browse {filtered.length} campus events</CardDescription>
            </div>
            {canCreate && (
              <Dialog open={open} onOpenChange={(v)=>{ setOpen(v); if (!v) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="gap-2" style={{ background: "var(--gradient-primary)" }}>
                    <Plus className="w-4 h-4" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Event" : "Create New Event"}</DialogTitle>
                    <DialogDescription>Fill in the event details below</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Event Title *</Label>
                        <Input value={form.title} onChange={(e)=>setForm(f=>({...f, title: e.target.value}))} required placeholder="e.g., Tech Fest 2025" />
                      </div>
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={form.category} onValueChange={(v)=>setForm(f=>({...f, category: v}))} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="cultural">Cultural</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="tech">Technical</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Venue *</Label>
                        <Input value={form.location} onChange={(e)=>setForm(f=>({...f, location: e.target.value}))} required placeholder="e.g., Main Auditorium" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date & Time *</Label>
                        <Input type="datetime-local" value={form.event_date} onChange={(e)=>setForm(f=>({...f, event_date: e.target.value}))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Department *</Label>
                        <Select value={form.department} onValueChange={(v)=>setForm(f=>({...f, department: v}))} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(d=> <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Club *</Label>
                        <Select value={form.club} onValueChange={(v)=>setForm(f=>({...f, club: v}))} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select club" />
                          </SelectTrigger>
                          <SelectContent>
                            {clubs.map(c=> <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Max Attendees (optional)</Label>
                      <Input type="number" value={form.max_attendees} onChange={(e)=>setForm(f=>({...f, max_attendees: e.target.value}))} placeholder="Leave empty for unlimited" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea value={form.description} onChange={(e)=>setForm(f=>({...f, description: e.target.value}))} rows={4} required placeholder="Describe your event..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Event Poster (optional)</Label>
                      <Input type="file" accept="image/*" onChange={(e)=>onPosterChange(e.target.files?.[0] || null)} />
                      {form.poster_data_url && (
                        <div className="mt-2">
                          <img src={form.poster_data_url} className="w-full max-w-xs h-32 object-cover rounded border" alt="Preview" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/30">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={form.isFeatured}
                        onChange={(e) => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <Label htmlFor="isFeatured" className="cursor-pointer font-medium">
                          Add to Upcoming Events Section
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Check this to display the event in the Upcoming Events section at the top. 
                          Unchecked events will only appear in the main events list.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1" style={{ background: "var(--gradient-primary)" }}>
                        {editingId ? "Update Event" : "Create Event"}
                      </Button>
                      <Button type="button" variant="outline" onClick={()=>{ setOpen(false); resetForm(); }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Input 
              placeholder="Search events..." 
              value={search} 
              onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} 
              className="max-w-xs"
            />
            <Select value={category ?? "all"} onValueChange={(v)=>{ setCategory(v === "all" ? null : v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="tech">Technical</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
            <Select value={onlyUpcoming?"upcoming":"all"} onValueChange={(v)=>{ setOnlyUpcoming(v==="upcoming"); setPage(1); }}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="all">All Events</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDept ?? "all"} onValueChange={(v)=>{ setFilterDept(v === "all" ? null : v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                {departments.map(d=> <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterClub ?? "all"} onValueChange={(v)=>{ setFilterClub(v === "all" ? null : v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clubs</SelectItem>
                {clubs.map(c=> <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Events Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paged.map(e => {
              const myReg = e.attendees.find(a => a.user_id === userId);
              const isOrganizer = e.organizer_id === userId;
              
              return (
                <Card key={e.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-1">{e.title}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">{e.category}</Badge>
                          {e.isFeatured && (
                            <Badge className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">⭐ Featured</Badge>
                          )}
                          {e.approvalStatus === "pending" && isApprover && (
                            <Badge variant="secondary" className="text-xs">Pending</Badge>
                          )}
                          {e.approvalStatus === "approved" && (
                            <Badge className="text-xs bg-green-500">Approved</Badge>
                          )}
                        </div>
                      </div>
                      {(isOrganizer || canCreate) && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={()=>startEdit(e)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={()=>remove(e.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(e.event_date).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {e.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {e.attendees.length} registered
                        {e.max_attendees && ` / ${e.max_attendees}`}
                      </div>
                    </div>
                    {(e.department || e.club) && (
                      <div className="text-xs text-muted-foreground">
                        {e.department} {e.department && e.club && "•"} {e.club}
                      </div>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => {
                        setSelectedEvent(e);
                        setDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </Button>
                    {!myReg && !isOrganizer && e.approvalStatus === "approved" && (
                      <Button size="sm" className="w-full" onClick={()=>registerIndividual(e.id)}>
                        Register
                      </Button>
                    )}
                    {myReg && (
                      <Badge className="w-full justify-center">Registered</Badge>
                    )}
                    {isApprover && e.approvalStatus === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-600" onClick={()=>{ store.approveEvent(e.id); load(); toast({ title: "Approved" }); }}>
                          <Check className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={()=>{ store.rejectEvent(e.id); load(); toast({ title: "Rejected" }); }}>
                          <X className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button 
                size="sm" 
                variant="outline" 
                disabled={page === 1} 
                onClick={()=>setPage(p=>p-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {Math.ceil(filtered.length / PAGE_SIZE)}
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)} 
                onClick={()=>setPage(p=>p+1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        open={detailsDialogOpen}
        onOpenChange={(open) => {
          setDetailsDialogOpen(open);
          if (!open) setSelectedEvent(null);
        }}
        userRole={userRole}
        onEdit={(event) => {
          startEdit(event);
          setDetailsDialogOpen(false);
        }}
        onDelete={(eventId) => {
          remove(eventId);
          setDetailsDialogOpen(false);
        }}
      />
    </div>
  );
}
