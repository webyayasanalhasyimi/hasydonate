import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const { profile } = await requireAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl">
      <h1 className="text-xl font-bold text-gray-800">Dashboard Placeholder</h1>
      <p className="text-sm text-gray-600 mt-2">
        Welcome, <span className="font-semibold text-gray-800">{profile.fullName}</span> ({profile.role}).
      </p>
      <p className="text-xs text-gray-500 mt-4">
        This page acts as a secure landing area. No features are implemented yet.
      </p>
    </div>
  );
}
