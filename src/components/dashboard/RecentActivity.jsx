import { format } from 'date-fns';
import { UserPlus, CreditCard, CalendarX } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'admission',
    title: 'New Student Admission',
    description: 'Ali Khan admitted to Class 9th',
    date: new Date(),
    icon: UserPlus,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    type: 'fee',
    title: 'Fee Payment Received',
    description: 'Received 5000 PKR from Sara Ahmed (Class 5)',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    icon: CreditCard,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 3,
    type: 'attendance',
    title: 'Teacher On Leave',
    description: 'Mr. Bilal is on sick leave today',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: CalendarX,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: 4,
    type: 'fee',
    title: 'Fee Payment Received',
    description: 'Received 4500 PKR from Usman (Class 3)',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    icon: CreditCard,
    color: 'bg-green-100 text-green-600',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Recent Activities</h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.color}`}>
                      <activity.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-slate-800">
                          {activity.title} <span className="font-medium text-slate-500">- {activity.description}</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-slate-500">
                        <time dateTime={activity.date.toISOString()}>
                          {format(activity.date, 'h:mm a')}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
