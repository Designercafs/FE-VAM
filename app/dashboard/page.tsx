"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserCheck,
  Clock,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  UserPlus,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { dummyVisitors, Visitor } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [visitors, setVisitors] = useState<Visitor[]>(dummyVisitors);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    purpose: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
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
    today: visitors.filter((v) => {
      const today = new Date().toDateString();
      return new Date(v.checkIn).toDateString() === today;
    }).length,
  };

  const handleApprove = (id: string) => {
    setVisitors(visitors.map((v) => (v.id === id ? { ...v, status: "approved" as const } : v)));
  };

  const handleReject = (id: string) => {
    setVisitors(visitors.map((v) => (v.id === id ? { ...v, status: "rejected" as const } : v)));
  };

  const handleAddVisitor = () => {
    if (!formData.name || !formData.email || !formData.company || !formData.purpose) {
      alert("Please fill in all required fields");
      return;
    }

    const newVisitor: Visitor = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      company: formData.company,
      purpose: formData.purpose,
      checkIn: new Date().toISOString(),
      status: "waiting",
    };

    setVisitors([...visitors, newVisitor]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      purpose: "",
    });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setVisitors(visitors.filter((v) => v.id !== id));
  };

  const handleReset = () => {
    setVisitors(dummyVisitors);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar currentPage="/dashboard" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 space-y-8">
          {user.role === "admin" ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 text-lg">
                  You have {stats.waiting} visitor requests waiting for approval
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                      Total Visitors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-gray-900">{stats.total}</div>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                      Waiting Approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-gray-900">{stats.waiting}</div>
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                      Approved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-gray-900">{stats.approved}</div>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserCheck className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                      Today's Visitors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-gray-900">{stats.today}</div>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <LayoutDashboard className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome, {user.name.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your visitor requests and track your visits
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                      My Visits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-gray-900">{visitors.length}</div>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                      Approved Visits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-gray-900">
                        {visitors.filter((v) => v.status === "approved").length}
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserCheck className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-600 font-medium text-sm uppercase tracking-wider">
                      Pending Visits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-gray-900">
                        {visitors.filter((v) => v.status === "waiting").length}
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isAdding && (
                <Card className="shadow-sm border-blue-100">
                  <CardHeader>
                    <CardTitle className="text-xl">Add New Visitor</CardTitle>
                    <CardDescription>
                      Fill in the details to create a new visitor record
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+62 812-3456-7890"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company *</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Tech Corp"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="purpose">Purpose *</Label>
                        <Textarea
                          id="purpose"
                          value={formData.purpose}
                          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                          placeholder="Business Meeting"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddVisitor}
                          className="bg-blue-600 hover:bg-blue-700 text-white">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Visitor
                        </Button>
                        <Button variant="outline" onClick={() => setIsAdding(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">My Visits</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Manage your visitor requests
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search visitors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full md:w-64 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      {!isAdding && (
                        <Button
                          onClick={() => setIsAdding(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Visitor
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="border-gray-200 hover:bg-gray-50">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
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
                          <TableHead className="font-semibold text-gray-700">
                            Check-in Time
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visitors
                          .filter((visitor) => {
                            const matchesSearch =
                              visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              visitor.company.toLowerCase().includes(searchTerm.toLowerCase());

                            return matchesSearch;
                          })
                          .map((visitor) => (
                            <TableRow key={visitor.id} className="hover:bg-blue-50/50">
                              <TableCell className="font-medium">
                                <div>
                                  <p className="font-semibold text-gray-900">{visitor.name}</p>
                                  <p className="text-sm text-gray-500">{visitor.email}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-700">{visitor.company}</TableCell>
                              <TableCell className="text-gray-700">{visitor.purpose}</TableCell>
                              <TableCell className="text-gray-700 text-sm">
                                {visitor.phone}
                              </TableCell>
                              <TableCell className="text-gray-600 text-sm">
                                {new Date(visitor.checkIn).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </TableCell>
                              <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(visitor.id)}
                                  className="text-red-600 hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === "admin" && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Visitor List</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Manage and track all visitor requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Company</TableHead>
                        <TableHead className="font-semibold text-gray-700">Purpose</TableHead>
                        <TableHead className="font-semibold text-gray-700">Check-in Time</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitors.map((visitor) => (
                        <TableRow key={visitor.id} className="hover:bg-blue-50/50">
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold text-gray-900">{visitor.name}</p>
                              <p className="text-sm text-gray-500">{visitor.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">{visitor.company}</TableCell>
                          <TableCell className="text-gray-700">{visitor.purpose}</TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {new Date(visitor.checkIn).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                          <TableCell className="text-right">
                            {visitor.status === "waiting" && (
                              <div className="flex gap-2 justify-end">
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
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
