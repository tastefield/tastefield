export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-gray-100" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
      <p className="mt-1 text-sm text-gray-500">
        You haven&apos;t created any projects yet.
      </p>
    </div>
  );
}
