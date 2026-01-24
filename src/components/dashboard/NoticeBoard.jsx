import { Image, MoreHorizontal, Eye } from 'lucide-react';

const notices = [
    {
        id: 1,
        title: "School Event Reminder",
        author: "Ms. Harper, Event Coordinator",
        date: "May 29, 2025",
        views: 436,
        color: "bg-[#FCD980] text-slate-900"
    },
    {
        id: 2,
        title: "Important Exam Update",
        author: "Principal Anderson",
        description: "Dear Students and Staff, Due to unforeseen circumstances...",
        date: "May 27, 2025",
        views: 574,
        color: "bg-[#FCD980] text-slate-900"
    }
];

export default function NoticeBoard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Notice Board</h3>
        <select className="bg-slate-50 border-none text-xs font-medium text-slate-600 rounded-lg py-1 px-2">
            <option>Latest</option>
            <option>Oldest</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {notices.map(notice => (
            <div key={notice.id} className="group">
                <div className="flex gap-4 mb-2">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${notice.color} shadow-sm`}>
                        <Image className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                             <div>
                                <h4 className="font-bold text-slate-800 text-sm truncate">{notice.title}</h4>
                                <p className="text-[10px] text-slate-400">by {notice.author}</p>
                             </div>
                             <span className="text-[10px] text-slate-400 whitespace-nowrap">{notice.date}</span>
                        </div>
                    </div>
                </div>
                {notice.description && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg leading-relaxed mb-2">
                        {notice.description}
                    </p>
                )}
                <div className="flex items-center justify-end gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{notice.views}</span>
                    </div>
                    <MoreHorizontal className="w-3 h-3 cursor-pointer" />
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}