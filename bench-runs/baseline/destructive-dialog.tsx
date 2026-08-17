export function DeleteAccountDialog() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Delete account</h2>
        <p className="mt-2 text-sm text-gray-600">
          This will permanently delete your account and all of its data. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700">
            Cancel
          </button>
          <button className="rounded-md bg-[#dc2626] px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
