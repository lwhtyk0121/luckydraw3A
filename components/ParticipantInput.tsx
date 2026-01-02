
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
}

const MOCK_NAMES = [
  "王大明", "李小美", "張志誠", "林心如", "陳冠宇", 
  "趙又廷", "許瑋甯", "郭雪芙", "曾國城", "蔡依林",
  "周杰倫", "林俊傑", "蕭敬騰", "楊丞琳", "羅志祥",
  "田馥甄", "吳青峰", "張惠妹", "陳奕迅", "鄧紫棋"
];

const ParticipantInput: React.FC<Props> = ({ participants, setParticipants }) => {
  const [textInput, setTextInput] = useState('');

  // Identify duplicates by name
  const processedParticipants = useMemo(() => {
    const nameCount: Record<string, number> = {};
    participants.forEach(p => {
      nameCount[p.name] = (nameCount[p.name] || 0) + 1;
    });

    return participants.map(p => ({
      ...p,
      isDuplicate: nameCount[p.name] > 1
    }));
  }, [participants]);

  const hasDuplicates = useMemo(() => {
    return processedParticipants.some(p => p.isDuplicate);
  }, [processedParticipants]);

  const handleBulkAdd = () => {
    const names = textInput
      .split(/[\n,;]/)
      .map(n => n.trim())
      .filter(n => n !== '');
    
    const newParticipants = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    setParticipants([...participants, ...newParticipants]);
    setTextInput('');
  };

  const loadMockData = () => {
    const mockParticipants = MOCK_NAMES.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    setParticipants([...participants, ...mockParticipants]);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) {
        return false;
      }
      seen.add(p.name);
      return true;
    });
    setParticipants(uniqueList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text
        .split(/[\n,;]/)
        .map(n => n.trim())
        .filter(n => n !== '' && n.toLowerCase() !== 'name');
      
      const newParticipants = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      setParticipants([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-users-medical text-indigo-500"></i> 匯入名單
            </h3>
            <button 
              onClick={loadMockData}
              className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              載入模擬名單
            </button>
          </div>
          <p className="text-sm text-gray-500 italic">支援換行、逗號或分號分隔姓名</p>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
            placeholder="例如：
王大明
李小美, 張志誠; 林心如"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleBulkAdd}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i> 加入名單
            </button>
            <label className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2 text-center border border-gray-300">
              <i className="fas fa-file-csv"></i> 上傳 CSV
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">當前名單 ({participants.length})</h3>
            <div className="flex gap-2">
              {hasDuplicates && (
                <button 
                  onClick={removeDuplicates}
                  className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded border border-red-200 font-bold transition-all"
                >
                  移除重複姓名
                </button>
              )}
              <button 
                onClick={() => setParticipants([])}
                className="text-xs text-red-500 hover:text-red-700 font-medium uppercase tracking-wider"
              >
                清空全部
              </button>
            </div>
          </div>
          <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-2">
            {participants.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                尚未加入任何名單
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {processedParticipants.map((p) => (
                  <div 
                    key={p.id} 
                    className={`group relative px-3 py-2 rounded-md shadow-sm border transition-colors flex justify-between items-center ${
                      p.isDuplicate 
                      ? 'bg-red-50 border-red-200 hover:border-red-400' 
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm text-gray-700 font-medium">{p.name}</span>
                      {p.isDuplicate && <span className="text-[9px] text-red-500 font-bold uppercase leading-none">重複項</span>}
                    </div>
                    <button 
                      onClick={() => removeParticipant(p.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantInput;
