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
import { UserPlus, LogOut, Menu, X, Search, Trash2, RefreshCw } from "lucide-react";
import { dummyVisitors, Visitor } from "@/lib/auth";

export default function MyVisitPage() {
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

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
              <UserPlus className="w-5 h-5" />
              Dashboard
            </a>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-medium transition-all">
              <UserPlus className="w-5 h-5" />
              My Visit
            </button>
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
            <h2 className="text-3xl font-bold text-gray-900">My Visit</h2>
            <p className="text-gray-600 mt-1">Manage your visitor requests and track your visits</p>
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
                    <UserPlus className="w-6 h-6 text-blue-600" />
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
                    <RefreshCw className="w-6 h-6 text-orange-600" />
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
                    <UserPlus className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">
                  Today's Visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.today}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isAdding && (
            <Card className="shadow-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl">Add New Visit Request</CardTitle>
                <CardDescription>Fill in the details to create a new visit request</CardDescription>
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
                      Add Visit Request
                    </Button>
                    <Button variant="outline" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm border-blue-100">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">My Visit List</CardTitle>
                  <CardDescription>Manage your visitor requests</CardDescription>
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
                  {!isAdding && (
                    <Button
                      onClick={() => setIsAdding(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Visit Request
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleReset}>
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
                      <TableHead className="font-semibold text-gray-700">Check-in Time</TableHead>
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
        </div>
      </div>
    </div>
  );
}
