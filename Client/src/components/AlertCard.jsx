import { Bell } from "lucide-react";

export default function AlertCard({ alerts = [] }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-[#11212D]" />
        <div>
          <h3 className="text-md font-semibold text-[#06141B]">
            Alerts & Notifications
          </h3>
          <p className="text-sm text-[#4A5C6A]">
            Important updates for you
          </p>
        </div>
      </div>

      {/* Content */}
      {alerts.length === 0 ? (
        <p className="text-sm text-[#9BA8AB]">
          You’re all caught up. No new alerts.
        </p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-gray-200 rounded-lg p-3"
            >
              {alert.title && (
                <p className="text-sm font-medium text-[#06141B]">
                  {alert.title}
                </p>
              )}
              <p className="text-sm text-[#4A5C6A] mt-1">
                {alert.message}
              </p>

              {alert.createdAt && (
                <p className="text-xs text-[#9BA8AB] mt-1">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
