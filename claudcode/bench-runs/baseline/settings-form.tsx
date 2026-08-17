export function SettingsForm() {
  return (
    <form className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-[18px] py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
