"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  DoorOpen as CheckOut,
} from "lucide-react";
import { dummyVisitors, Visitor } from "@/lib/auth";

export default function VisitorManagementPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [visitors, setVisitors] = useState<Visitor[]>(dummyVisitors);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    if (!isLoading && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: visitors.length,
    waiting: visitors.filter((v) => v.status === "waiting").length,
    approved: visitors.filter((v) => v.status === "approved").length,
    checkedOut: visitors.filter((v) => v.status === "checked-out").length,
  };

  const handleApprove = (id: string) => {
    setVisitors(visitors.map((v) => (v.id === id ? { ...v, status: "approved" as const } : v)));
  };

  const handleReject = (id: string) => {
    setVisitors(visitors.map((v) => (v.id === id ? { ...v, status: "rejected" as const } : v)));
  };

  const handleCheckOut = (id: string) => {
    setVisitors(
      visitors.map((v) =>
        v.id === id
          ? { ...v, status: "checked-out" as const, checkOut: new Date().toISOString() }
          : v,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setVisitors(visitors.filter((v) => v.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "outline" | "destructive"; label: string }
    > = {
      waiting: { variant: "secondary", label: "Waiting" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      "checked-out": { variant: "outline", label: "Checked Out" },
    };
    const config = variants[status] || variants.waiting;
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || visitor.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
        <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Visitor System
        </h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Visitor System
            </h1>
            <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <a
              href="/dashboard"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <Users className="w-5 h-5" />
              Dashboard
            </a>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-medium transition-all">
              <Users className="w-5 h-5" />
              Visitor Management
            </button>
            <a
              href="/dashboard/room-management"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <Users className="w-5 h-5" />
              Room Management
            </a>
            <a
              href="/dashboard/user-management"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <Users className="w-5 h-5" />
              User Management
            </a>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-blue-50 rounded-lg p-4 mb-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600 mt-1">{user.email}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="w-full justify-start gap-2 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Visitor Management</h2>
            <p className="text-gray-600 mt-1">
              Manage and track all visitor requests and approvals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">
                  Total Visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">
                  Waiting Approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.waiting}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">Approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.approved}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">Checked Out</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.checkedOut}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <CheckOut className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-blue-100">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Visitor List</CardTitle>
                  <CardDescription>Manage and track all visitor requests</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search visitors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="waiting">Waiting</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="checked-out">Checked Out</option>
                  </select>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Visitor
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Company</TableHead>
                      <TableHead className="font-semibold text-gray-700">Purpose</TableHead>
                      <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                      <TableHead className="font-semibold text-gray-700">Check-in Time</TableHead>
                      <TableHead className="font-semibold text-gray-700">Check-out Time</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisitors.map((visitor) => (
                      <TableRow key={visitor.id} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold text-gray-900">{visitor.name}</p>
                            <p className="text-sm text-gray-500">{visitor.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{visitor.company}</TableCell>
                        <TableCell className="text-gray-700">{visitor.purpose}</TableCell>
                        <TableCell className="text-gray-700 text-sm">{visitor.phone}</TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {new Date(visitor.checkIn).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {visitor.checkOut
                            ? new Date(visitor.checkOut).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {visitor.status === "waiting" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(visitor.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(visitor.id)}>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {visitor.status === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCheckOut(visitor.id)}
                                className="border-purple-200 hover:bg-purple-50 hover:text-purple-600">
                                <CheckOut className="w-4 h-4 mr-1" />
                                Check Out
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(visitor.id)}
                              className="text-red-600 hover:bg-red-50">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
