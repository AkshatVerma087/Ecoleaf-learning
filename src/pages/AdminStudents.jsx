import { useState, useEffect } from "react";
import { Search, ChevronUp, ChevronDown, Flame, Star } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { adminAPI } from "@/services/api";
import { toast } from "sonner";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("xp");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await adminAPI.getStudents(search, sortBy, sortOrder);
        setStudents(data);
      } catch (error) {
        toast.error(error.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [search, sortBy, sortOrder]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Students</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage student progress across the platform.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Students Table */}
      <EcoCard className="overflow-hidden p-0" hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Student
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-left text-sm font-semibold text-foreground"
                  onClick={() => toggleSort("level")}
                >
                  <div className="flex items-center gap-1">
                    Level
                    <SortIcon field="level" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-left text-sm font-semibold text-foreground"
                  onClick={() => toggleSort("xp")}
                >
                  <div className="flex items-center gap-1">
                    XP
                    <SortIcon field="xp" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-left text-sm font-semibold text-foreground"
                  onClick={() => toggleSort("streak")}
                >
                  <div className="flex items-center gap-1">
                    Streak
                    <SortIcon field="streak" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-left text-sm font-semibold text-foreground"
                  onClick={() => toggleSort("progress")}
                >
                  <div className="flex items-center gap-1">
                    Progress
                    <SortIcon field="progress" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id || student.id}
                    className="border-b border-border transition-colors hover:bg-muted/30"
                  >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-eco-mint px-3 py-1 text-sm font-medium text-foreground">
                      <Star className="h-3.5 w-3.5 text-yellow-500" />
                      {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary">
                      {student.xp.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {student.streak} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </EcoCard>

      {filteredStudents.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No students found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
