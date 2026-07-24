import React from 'react';
import ComplaintForm from './components/ComplaintForm';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <div className="bg-slate-100 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7">
          <ComplaintForm />
        </div>
        
        
        <div className="lg:col-span-5">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}

export default App;