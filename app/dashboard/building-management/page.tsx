"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Search, Plus, Edit, Trash2 } from "lucide-react";
import { dummyBuildings, Building } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

export default function BuildingManagementPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>(dummyBuildings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    floors: number;
    description: string;
  }>({
    name: "",
    address: "",
    floors: 1,
    description: "",
  });

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
    total: buildings.length,
    totalFloors: buildings.reduce((sum, b) => sum + b.floors, 0),
  };

  const handleDelete = (id: string) => {
    setBuildings(buildings.filter((b) => b.id !== id));
  };

  const handleAddBuilding = () => {
    if (!formData.name || !formData.address || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    const newBuilding: Building = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      floors: formData.floors,
      description: formData.description,
    };

    setBuildings([...buildings, newBuilding]);
    setFormData({
      name: "",
      address: "",
      floors: 1,
      description: "",
    });
    setIsAdding(false);
  };

  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch =
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar
        currentPage="/dashboard/building-management"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Building Management</h2>
            <p className="text-gray-600 mt-1">Manage and monitor all buildings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">
                  Total Buildings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600 font-medium">
                  Total Floors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stats.totalFloors}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isAdding && (
            <Card className="shadow-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl">Add New Building</CardTitle>
                <CardDescription>Fill in the details to create a new building</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Building Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Main Office Building"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Business Street, Jakarta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floors">Number of Floors *</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.floors}
                      onChange={(e) =>
                        setFormData({ ...formData, floors: parseInt(e.target.value) || 1 })
                      }
                      placeholder="5"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Main corporate office building"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddBuilding}
                      className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Building
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
                  <CardTitle className="text-xl">Building List</CardTitle>
                  <CardDescription>Manage and monitor all buildings</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search buildings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-64"
                    />
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setIsAdding(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Building
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Building Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Address</TableHead>
                      <TableHead className="font-semibold text-gray-700">Floors</TableHead>
                      <TableHead className="font-semibold text-gray-700">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuildings.map((building) => (
                      <TableRow key={building.id} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium">
                          <p className="font-semibold text-gray-900">{building.name}</p>
                          <p className="text-sm text-gray-500">ID: {building.id}</p>
                        </TableCell>
                        <TableCell className="text-gray-700">{building.address}</TableCell>
                        <TableCell className="text-gray-700">{building.floors}</TableCell>
                        <TableCell className="text-gray-700">{building.description}</TableCell>
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
                              onClick={() => handleDelete(building.id)}
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
