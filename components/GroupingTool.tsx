
import React, { useState } from 'react';
import { Participant, GroupResult } from '../types';
import { getTeamEnhancements } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const GroupingTool: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [results, setResults] = useState<GroupResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const performGrouping = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    const shuffled: Participant[] = shuffleArray<Participant>(participants);
    const groups: GroupResult[] = [];

    for (let i = 0; i < shuffled.length; i += groupSize) {
      groups.push({
        groupName: `第 ${groups.length + 1} 組`,
        members: shuffled.slice(i, i + groupSize)
      });
    }

    console.log("Starting grouping with", groups.length, "groups");
    try {
      const enhancements = await getTeamEnhancements(groups.length);
      console.log("Enhancements received:", enhancements);
      if (enhancements && Array.isArray(enhancements)) {
        enhancements.forEach((enh, idx) => {
          if (groups[idx]) {
            groups[idx].groupName = enh.groupName;
            groups[idx].iceBreaker = enh.iceBreaker;
          }
        });
      }
    } catch (e) {
      console.error("Grouping enhancement error:", e);
    }

    console.log("Setting results and finishing");
    setResults(groups);
    setIsGenerating(false);
  };

  const exportCSV = () => {
    if (results.length === 0) return;

    // Build CSV content
    const header = "組別,姓名\n";
    const rows = results.flatMap(group =>
      group.members.map(member => `${group.groupName},${member.name}`)
    ).join("\n");

    const csvContent = "\uFEFF" + header + rows; // Add BOM for Excel support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-semibold text-gray-700">每組人數</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="2"
              max="20"
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="w-12 text-center font-bold text-indigo-600 bg-indigo-50 rounded-md py-1 border border-indigo-100">{groupSize}</span>
          </div>
        </div>

        <div className="flex-1 text-sm text-gray-500">
          根據目前 {participants.length} 人，將分為 {Math.ceil(participants.length / groupSize)} 組
        </div>

        <button
          onClick={performGrouping}
          disabled={isGenerating || participants.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:bg-gray-400"
        >
          {isGenerating ? (
            <><i className="fas fa-spinner fa-spin"></i> 正在智能分組...</>
          ) : (
            <><i className="fas fa-layer-group"></i> 開始自動分組</>
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-gray-800">分組結果</h3>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
            >
              <i className="fas fa-file-export"></i> 下載分組紀錄 (CSV)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((group, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform">
                <div className="bg-indigo-600 px-4 py-3 text-white flex justify-between items-center">
                  <h4 className="font-bold truncate">{group.groupName}</h4>
                  <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded-full">{group.members.length} 人</span>
                </div>
                <div className="p-4 flex-grow space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {group.members.map(member => (
                      <span key={member.id} className="text-sm bg-gray-100 px-2.5 py-1 rounded-full text-gray-700 border border-gray-200">
                        {member.name}
                      </span>
                    ))}
                  </div>
                  {group.iceBreaker && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="text-xs font-bold text-yellow-700 flex items-center gap-1 mb-1">
                        <i className="fas fa-lightbulb"></i> AI 破冰任務
                      </p>
                      <p className="text-xs text-yellow-800 leading-relaxed italic">
                        「{group.iceBreaker}」
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupingTool;
