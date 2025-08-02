"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatDistanceToNowStrict } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contentStats, setContentStats] = useState<any>(null);
  const [engagementMetrics, setEngagementMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (
      !session?.user ||
      (session.user as { role?: string })?.role !== "ADMIN"
    ) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if ((session?.user as any)?.role !== "ADMIN") return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, metricsRes, usersRes] = await Promise.all([
          axios.get("/api/admin/content-stats"),
          axios.get("/api/admin/engagement-metrics"),
          axios.get("/api/admin/users"),
        ]);

        setContentStats(statsRes.data);
        setEngagementMetrics(metricsRes.data);
        setUsers(usersRes.data.users);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contentData = [
    { name: "Questions", value: contentStats?.totalQuestions || 0 },
    { name: "Answers", value: contentStats?.totalAnswers || 0 },
    { name: "Comments", value: contentStats?.totalComments || 0 },
    { name: "Unanswered", value: contentStats?.unansweredQuestions || 0 },
  ];

  const votingData = [
    {
      name: "Votes",
      upvotes: engagementMetrics?.votingActivity?.upvotes || 0,
      downvotes: engagementMetrics?.votingActivity?.downvotes || 0,
    },
  ];

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1e] text-white px-4 py-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold font-serif mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage and monitor platform activity</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {contentStats?.totalQuestions || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {contentStats?.totalAnswers || 0}
              </p>
              <p className="text-sm text-gray-400">
                {contentStats?.approvalRate || 0}% approved
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {contentStats?.totalComments || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Unanswered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {contentStats?.unansweredQuestions || 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-gray-300">
                Content Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {contentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1e",
                      borderColor: "#3a3a3e",
                      color: "#ffffff",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: "#ffffff",
                      paddingTop: "20px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Voting Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={votingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3e" />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    tick={{ fill: "#9ca3af" }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1e",
                      borderColor: "#3a3a3e",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="upvotes"
                    fill="#4CAF50"
                    name="Upvotes"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="downvotes"
                    fill="#F44336"
                    name="Downvotes"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Tags Section */}
        {engagementMetrics?.topTags && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-zinc-900 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-gray-300">Top Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {engagementMetrics.topTags.map((tag: any) => (
                    <Badge
                      key={tag.name}
                      className="bg-blue-600/30 text-blue-300 border border-blue-500 hover:bg-blue-600/40"
                    >
                      {tag.name} ({tag.questionCount})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-300">Users</CardTitle>
                <Input
                  placeholder="Search users..."
                  className="max-w-sm bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption className="text-gray-500">
                  {filteredUsers.length} user(s) found
                </TableCaption>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-gray-300">Username</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Role</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    <TableHead className="text-right text-gray-300">
                      Questions
                    </TableHead>
                    <TableHead className="text-right text-gray-300">
                      Answers
                    </TableHead>
                    <TableHead className="text-right text-gray-300">
                      Comments
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                      onClick={() => router.push(`/profile/${user.id}`)}
                    >
                      <TableCell className="font-medium text-white">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "ADMIN" ? "default" : "secondary"
                          }
                          className={
                            user.role === "ADMIN"
                              ? "bg-purple-600/30 text-purple-300 border-purple-500"
                              : "bg-zinc-700/30 text-zinc-300 border-zinc-600"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {formatDistanceToNowStrict(new Date(user.createdAt))}{" "}
                        ago
                      </TableCell>
                      <TableCell className="text-right text-gray-300">
                        {user._count?.questions || 0}
                      </TableCell>
                      <TableCell className="text-right text-gray-300">
                        {user._count?.answers || 0}
                      </TableCell>
                      <TableCell className="text-right text-gray-300">
                        {user._count?.comments || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
