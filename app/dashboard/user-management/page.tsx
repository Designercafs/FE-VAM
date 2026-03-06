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
  UserCog,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { dummyUsers, User as UserType } from "@/lib/auth";

export default function UserManagementPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>(dummyUsers);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

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
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    visitors: users.filter((u) => u.role === "visitor").length,
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "outline"; label: string }
    > = {
      admin: { variant: "default", label: "Admin" },
      visitor: { variant: "secondary", label: "Visitor" },
    };
    const config = variants[role] || variants.visitor;
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  };

  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || userItem.role === filterRole;

    return matchesSearch && matchesRole;
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
              <UserCog className="w-5 h-5" />
              Dashboard
            </a>
            <a
              href="/dashboard/visitor-management"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <UserCog className="w-5 h-5" />
              Visitor Management
            </a>
            <a
              href="/dashboard/room-management"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <UserCog className="w-5 h-5" />
              Room Management
            </a>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-medium transition-all">
              <UserCog className="w-5 h-5" />
              User Management
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
            <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage and monitor all system users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">Total Users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">Admins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.admins}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">Visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.visitors}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-blue-100">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">User List</CardTitle>
                  <CardDescription>Manage and monitor all system users</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-64"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="visitor">Visitor</option>
                  </select>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
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
                      <TableHead className="font-semibold text-gray-700">Email</TableHead>
                      <TableHead className="font-semibold text-gray-700">Role</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userItem) => (
                      <TableRow key={userItem.id} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium">
                          <p className="font-semibold text-gray-900">{userItem.name}</p>
                          <p className="text-sm text-gray-500">ID: {userItem.id}</p>
                        </TableCell>
                        <TableCell className="text-gray-700">{userItem.email}</TableCell>
                        <TableCell>{getRoleBadge(userItem.role)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(userItem.id)}
                              className="text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
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
