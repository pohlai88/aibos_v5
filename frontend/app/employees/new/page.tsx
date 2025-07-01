"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Department {
  id: string;
  name: string;
}

export default function NewEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    ic_number: "",
    passport_number: "",
    full_name: "",
    primary_email: "",
    recovery_email: "",
    has_recovery_email: false,
    user_type: "candidate",
    role: "",
    status: "active",
    department_id: "",
    position: "",
    date_joined: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await getSupabaseClient()
        .from("departments")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error fetching departments:", error);
        return;
      }

      if (data) {
        setDepartments(data as unknown as Department[]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.primary_email.trim()) {
      newErrors.primary_email = "Primary email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primary_email)) {
      newErrors.primary_email = "Please enter a valid email address";
    }

    // Employee-specific validation
    if (formData.user_type === "employee") {
      if (!formData.recovery_email.trim()) {
        newErrors.recovery_email = "Recovery email is required for employees";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recovery_email)) {
        newErrors.recovery_email =
          "Please enter a valid recovery email address";
      }

      if (formData.primary_email === formData.recovery_email) {
        newErrors.recovery_email =
          "Recovery email must be different from primary email";
      }
    }

    // IC/Passport validation (at least one should be provided)
    if (!formData.ic_number.trim() && !formData.passport_number.trim()) {
      newErrors.ic_number = "Either IC number or passport number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const employeeData = {
        ...formData,
        has_recovery_email:
          formData.user_type === "employee" && !!formData.recovery_email,
        // Convert empty strings to null for optional fields
        ic_number: formData.ic_number.trim() || null,
        passport_number: formData.passport_number.trim() || null,
        employee_id: formData.employee_id.trim() || null,
        role: formData.role.trim() || null,
        position: formData.position.trim() || null,
        department_id: formData.department_id || null,
        date_joined: formData.date_joined || null,
      };

      const { error } = await getSupabaseClient()
        .from("employee_master")
        .insert([employeeData]);

      if (error) {
        console.error("Error creating employee:", error);
        alert("Error creating employee. Please try again.");
        return;
      }

      alert("Employee created successfully!");
      router.push("/employees");
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
                Add New Employee
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new employee record
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

        {/* Form */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="full_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                      className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.full_name ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.full_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="employee_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Employee ID
                    </label>
                    <input
                      type="text"
                      id="employee_id"
                      value={formData.employee_id}
                      onChange={(e) =>
                        handleInputChange("employee_id", e.target.value)
                      }
                      placeholder="EMP-001"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="primary_email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Primary Email *
                    </label>
                    <input
                      type="email"
                      id="primary_email"
                      value={formData.primary_email}
                      onChange={(e) =>
                        handleInputChange("primary_email", e.target.value)
                      }
                      className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.primary_email
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.primary_email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.primary_email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="recovery_email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Recovery Email {formData.user_type === "employee" && "*"}
                    </label>
                    <input
                      type="email"
                      id="recovery_email"
                      value={formData.recovery_email}
                      onChange={(e) =>
                        handleInputChange("recovery_email", e.target.value)
                      }
                      className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.recovery_email
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.recovery_email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.recovery_email}
                      </p>
                    )}
                    {formData.user_type === "employee" && (
                      <p className="mt-1 text-xs text-gray-500">
                        Required for employees
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Identity Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Identity Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ic_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      IC Number
                    </label>
                    <input
                      type="text"
                      id="ic_number"
                      value={formData.ic_number}
                      onChange={(e) =>
                        handleInputChange("ic_number", e.target.value)
                      }
                      className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.ic_number ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.ic_number && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.ic_number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="passport_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Passport Number
                    </label>
                    <input
                      type="text"
                      id="passport_number"
                      value={formData.passport_number}
                      onChange={(e) =>
                        handleInputChange("passport_number", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Employment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="user_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      User Type *
                    </label>
                    <select
                      id="user_type"
                      value={formData.user_type}
                      onChange={(e) =>
                        handleInputChange("user_type", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="candidate">Candidate</option>
                      <option value="employee">Employee</option>
                      <option value="contractor">Contractor</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="department_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Department
                    </label>
                    <select
                      id="department_id"
                      value={formData.department_id}
                      onChange={(e) =>
                        handleInputChange("department_id", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pre-boarding">Pre-boarding</option>
                      <option value="left-company">Left Company</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      placeholder="e.g., Software Engineer"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      placeholder="e.g., Senior Developer"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="date_joined"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date Joined
                  </label>
                  <input
                    type="date"
                    id="date_joined"
                    value={formData.date_joined}
                    onChange={(e) =>
                      handleInputChange("date_joined", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  href="/employees"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
