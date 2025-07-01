"use client";

import { useState } from "react";
import { getSupabaseClient } from "../../../lib/supabaseClient";
import Link from "next/link";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setupDepartments = async () => {
    setLoading(true);
    setMessage("Setting up departments...");

    try {
      const departments = [
        { name: "Engineering" },
        { name: "Marketing" },
        { name: "Sales" },
        { name: "Human Resources" },
        { name: "Finance" },
        { name: "Operations" },
        { name: "Customer Support" },
        { name: "Product Management" },
      ];

      const { error } = await getSupabaseClient()
        .from("departments")
        .insert(departments);

      if (error) {
        console.error("Error creating departments:", error);
        setMessage("Error creating departments: " + error.message);
        return;
      }

      setMessage("Departments created successfully!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error creating departments");
    } finally {
      setLoading(false);
    }
  };

  const setupSampleEmployees = async () => {
    setLoading(true);
    setMessage("Setting up sample employees...");

    try {
      // First get departments
      const { data: departments } = await getSupabaseClient()
        .from("departments")
        .select("id, name");

      if (!departments || departments.length === 0) {
        setMessage("Please create departments first!");
        return;
      }

      const engineeringDept = departments.find((d) => d.name === "Engineering");
      const marketingDept = departments.find((d) => d.name === "Marketing");
      const hrDept = departments.find((d) => d.name === "Human Resources");

      const sampleEmployees = [
        {
          employee_id: "EMP-001",
          ic_number: "123456789012",
          full_name: "John Doe",
          primary_email: "john.doe@company.com",
          recovery_email: "john.doe@gmail.com",
          has_recovery_email: true,
          user_type: "employee",
          role: "Senior Software Engineer",
          status: "active",
          department_id: engineeringDept?.id,
          position: "Senior Developer",
          date_joined: "2023-01-15",
        },
        {
          employee_id: "EMP-002",
          ic_number: "234567890123",
          full_name: "Jane Smith",
          primary_email: "jane.smith@company.com",
          recovery_email: "jane.smith@outlook.com",
          has_recovery_email: true,
          user_type: "employee",
          role: "Marketing Manager",
          status: "active",
          department_id: marketingDept?.id,
          position: "Manager",
          date_joined: "2022-08-20",
        },
        {
          employee_id: "EMP-003",
          passport_number: "A12345678",
          full_name: "Mike Johnson",
          primary_email: "mike.johnson@company.com",
          user_type: "contractor",
          role: "UI/UX Designer",
          status: "active",
          department_id: engineeringDept?.id,
          position: "Contractor",
          date_joined: "2023-03-10",
        },
        {
          employee_id: "EMP-004",
          ic_number: "345678901234",
          full_name: "Sarah Wilson",
          primary_email: "sarah.wilson@company.com",
          recovery_email: "sarah.wilson@yahoo.com",
          has_recovery_email: true,
          user_type: "employee",
          role: "HR Specialist",
          status: "active",
          department_id: hrDept?.id,
          position: "Specialist",
          date_joined: "2022-11-05",
        },
        {
          full_name: "Alex Chen",
          primary_email: "alex.chen@company.com",
          user_type: "candidate",
          status: "pre-boarding",
          date_joined: "2024-01-20",
        },
      ];

      const { error } = await getSupabaseClient()
        .from("employee_master")
        .insert(sampleEmployees);

      if (error) {
        console.error("Error creating sample employees:", error);
        setMessage("Error creating sample employees: " + error.message);
        return;
      }

      setMessage("Sample employees created successfully!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error creating sample employees");
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all data? This cannot be undone!"
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("Clearing all data...");

    try {
      // Clear employees first (due to foreign key constraint)
      const { error: employeeError } = await getSupabaseClient()
        .from("employee_master")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (employeeError) {
        console.error("Error clearing employees:", employeeError);
        setMessage("Error clearing employees: " + employeeError.message);
        return;
      }

      // Clear departments
      const { error: deptError } = await getSupabaseClient()
        .from("departments")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (deptError) {
        console.error("Error clearing departments:", deptError);
        setMessage("Error clearing departments: " + deptError.message);
        return;
      }

      setMessage("All data cleared successfully!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error clearing data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Setup Database
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Initialize your database with sample data for testing
              </p>
            </div>
            <Link
              href="/employees"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Employees
            </Link>
          </div>
        </div>

        {/* Setup Options */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Database Setup
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Use these buttons to set up your database with sample data for
                testing the employee management system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={setupDepartments}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Sample Departments
              </button>

              <button
                onClick={setupSampleEmployees}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Sample Employees
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={clearAllData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All Data (Danger!)
              </button>
            </div>

            {message && (
              <div
                className={`mt-4 p-4 rounded-md ${
                  message.includes("Error")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                What this creates:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • 8 sample departments (Engineering, Marketing, Sales, etc.)
                </li>
                <li>
                  • 5 sample employees with different user types and statuses
                </li>
                <li>• Mix of employees, contractors, and candidates</li>
                <li>• Various statuses (active, pre-boarding)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
