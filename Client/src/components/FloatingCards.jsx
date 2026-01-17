export default function FloatingCards() {
  return (
    <div className="relative flex gap-6 justify-center items-start -mt-24 px-6">
      <div className="w-64 h-40 p-6 rounded-2xl bg-white shadow-md float-slow">
        <h4 className="font-semibold mb-2">Quick Tips</h4>
        <p className="text-sm text-gray-500">Bite-sized AI suggestions.</p>
      </div>

      <div className="w-64 h-40 p-6 rounded-2xl bg-white shadow-lg float-medium translate-y-6">
        <h4 className="font-semibold mb-2">Progress</h4>
        <p className="text-sm text-gray-500">Track goals and milestones.</p>
      </div>

      <div className="w-64 h-40 p-6 rounded-2xl bg-white shadow-xl float-fast translate-y-12">
        <h4 className="font-semibold mb-2">Insights</h4>
        <p className="text-sm text-gray-500">Smart analytics at a glance.</p>
      </div>
    </div>
  );
}
