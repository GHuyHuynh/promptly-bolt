export function NavbarSkeleton() {
  return (
    <div className="fixed top-0 w-full bg-white/60 backdrop-blur-sm z-40 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="w-32 h-8 bg-gray-200 rounded-lg" />
          <div className="hidden md:flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-8 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg md:hidden" />
        </div>
      </div>
    </div>
  );
}