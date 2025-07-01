"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";
import Link from "next/link";

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  primary_email: string;
  recovery_email?: string;
  user_type: string;
  role?: string;
  status: string;
  department_id?: string;
  position?: string;
  date_joined?: string;
  created_at: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");

  useEffect(() => {
    fetchEmployees();
  }, [filterStatus]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      let query = getSupabaseClient()
        .from("employee_master")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching employees:", error);
        return;
      }

      if (data) {
        setEmployees(data as unknown as Employee[]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this employee?")) return;

    try {
      const { error } = await getSupabaseClient()
        .from("employee_master")
        .update({ status: "inactive" })
        .eq("id", id);

      if (error) {
        console.error("Error deactivating employee:", error);
        return;
      }

      // Refresh the list
      fetchEmployees();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.primary_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      "pre-boarding": {
        color: "bg-blue-100 text-blue-800",
        label: "Pre-boarding",
      },
      "left-company": {
        color: "bg-red-100 text-red-800",
        label: "Left Company",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    const typeConfig = {
      employee: { color: "bg-purple-100 text-purple-800", label: "Employee" },
      candidate: { color: "bg-yellow-100 text-yellow-800", label: "Candidate" },
      contractor: {
        color: "bg-orange-100 text-orange-800",
        label: "Contractor",
      },
      vendor: { color: "bg-indigo-100 text-indigo-800", label: "Vendor" },
    };

    const config =
      typeConfig[userType as keyof typeof typeConfig] || typeConfig.candidate;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your organization&apos;s employee records
              </p>
            </div>
            <Link
              href="/employees/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Employee
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, ID, or email..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pre-boarding">Pre-boarding</option>
                  <option value="left-company">Left Company</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <p className="text-sm text-gray-500">
                  {filteredEmployees.length} employee
                  {filteredEmployees.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">
                  Loading employees...
                </p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No employees found.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <li key={employee.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {employee.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {employee.full_name}
                            </h3>
                            {getStatusBadge(employee.status)}
                            {getUserTypeBadge(employee.user_type)}
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            {employee.employee_id && (
                              <span>ID: {employee.employee_id}</span>
                            )}
                            <span>{employee.primary_email}</span>
                            {employee.role && <span>{employee.role}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/employees/${employee.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        {employee.status === "active" && (
                          <button
                            onClick={() => handleSoftDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
