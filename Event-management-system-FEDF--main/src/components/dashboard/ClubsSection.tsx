import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  president_name?: string | null;
}

const ClubsSection = ({ userId, userRole }: { userId: string; userRole?: string }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const raw = localStorage.getItem("cc_clubs");
    const list: Club[] = raw ? JSON.parse(raw) : [];
    setClubs(list.sort((a,b)=>a.name.localeCompare(b.name)));
    setLoading(false);
  };

  const handleJoin = async (clubId: string) => {
    const raw = localStorage.getItem("cc_clubs");
    const list: Club[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex(c=>c.id===clubId);
    if (idx>=0){
      list[idx].member_count = (list[idx].member_count||0)+1;
      localStorage.setItem("cc_clubs", JSON.stringify(list));
      setClubs(list);
      toast({ title: "Success", description: "Joined club successfully!" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Student Clubs</h3>
        <p className="text-muted-foreground">Join clubs and connect with like-minded students</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <Card key={club.id} className="hover:shadow-lg transition-all hover:scale-105 animate-fade-in" style={{ boxShadow: "var(--shadow-sm)" }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{club.name}</CardTitle>
                  <Badge className="capitalize">{club.category}</Badge>
                </div>
                <CardDescription className="line-clamp-3">{club.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {club.member_count} members
                </div>
                {club.president_name && (
                  <p className="text-sm text-muted-foreground">
                    President: {club.president_name}
                  </p>
                )}
                <Button className="w-full gap-2" size="sm" onClick={() => handleJoin(club.id)} style={{ background: "var(--gradient-primary)" }}>
                  <UserPlus className="w-4 h-4" />
                  Join Club
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubsSection;

