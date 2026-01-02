
import React, { useState } from 'react';
import { Participant, AppTab } from './types';
import ParticipantInput from './components/ParticipantInput';
import LuckyDraw from './components/LuckyDraw';
import GroupingTool from './components/GroupingTool';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LIST);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                <i className="fas fa-rocket"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">HR Pro Toolset</h1>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">HR 專業工具箱</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab(AppTab.LIST)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === AppTab.LIST 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-list-ul"></i> 名單管理
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.DRAW)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === AppTab.DRAW 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-gift"></i> 獎品抽籤
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.GROUPS)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === AppTab.GROUPS 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-users-viewfinder"></i> 自動分組
              </button>
            </nav>

            <div className="text-xs text-gray-400 flex items-center gap-4">
              <span className="hidden sm:inline">目前人數: <strong className="text-indigo-600">{participants.length}</strong></span>
              <a href="https://github.com" className="hover:text-gray-600"><i className="fab fa-github text-lg"></i></a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around py-3 shadow-2xl">
        <button onClick={() => setActiveTab(AppTab.LIST)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.LIST ? 'text-indigo-600' : 'text-gray-400'}`}>
          <i className="fas fa-list-ul"></i>
          <span className="text-[10px] font-bold">名單</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.DRAW)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.DRAW ? 'text-indigo-600' : 'text-gray-400'}`}>
          <i className="fas fa-gift"></i>
          <span className="text-[10px] font-bold">抽籤</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.GROUPS)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.GROUPS ? 'text-indigo-600' : 'text-gray-400'}`}>
          <i className="fas fa-users-viewfinder"></i>
          <span className="text-[10px] font-bold">分組</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {participants.length === 0 && activeTab !== AppTab.LIST && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 text-4xl">
              <i className="fas fa-user-slash"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-600">您的名單目前是空的</h2>
            <p className="text-gray-500 max-w-sm">請先在「名單管理」分頁上傳或貼上參與者姓名，才能進行抽籤或分組功能。</p>
            <button 
              onClick={() => setActiveTab(AppTab.LIST)}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
            >
              去新增名單
            </button>
          </div>
        )}

        {activeTab === AppTab.LIST && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                 <h2 className="text-3xl font-bold mb-2">準備好您的名單 📁</h2>
                 <p className="opacity-90 max-w-md">上傳 CSV 或貼上姓名，我們將為您處理後續的抽籤與分組。資料僅在本地瀏覽器處理，安全可靠。</p>
               </div>
               <div className="text-5xl opacity-30">
                 <i className="fas fa-id-card-clip"></i>
               </div>
             </div>
             <ParticipantInput participants={participants} setParticipants={setParticipants} />
          </div>
        )}

        {activeTab === AppTab.DRAW && participants.length > 0 && (
          <div className="animate-fadeIn">
            <LuckyDraw participants={participants} />
          </div>
        )}

        {activeTab === AppTab.GROUPS && participants.length > 0 && (
          <div className="animate-fadeIn">
            <GroupingTool participants={participants} />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="text-center py-10 text-gray-400 text-sm">
        <p>&copy; 2024 HR Pro Toolset. Designed for Efficiency.</p>
      </footer>
    </div>
  );
};

export default App;
