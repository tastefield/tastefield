export function NavHeader() {
  return (
    <header className="flex h-[68px] items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="text-lg font-bold text-gray-900">Acme</div>
      <nav className="flex gap-6 text-sm text-gray-600">
        <a href="/product" className="hover:text-gray-900">Product</a>
        <a href="/pricing" className="hover:text-gray-900">Pricing</a>
        <a href="/docs" className="hover:text-gray-900">Docs</a>
      </nav>
      <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Sign in
      </button>
    </header>
  );
}
