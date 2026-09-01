import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Plus, Trash2, Save, Download, Upload, Wallet, ArrowUpCircle, ArrowDownCircle, Settings2, Table as TableIcon, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { FREQUENCIES, VANGUARD_FUNDS } from './calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const STORAGE_KEY = 'fin-planner-data-v2';

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaults = {
      planStartDate: new Date().toISOString().split('T')[0],
      beginBalance: 1000,
      reserveAmount: 5000,
      expenses: [],
      compensation: [],
      portfolio: [],
      yAxisMin0: false
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });
  
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const workerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    
    worker.onmessage = (e) => {
      setDailyData(e.data);
      setLoading(false);
      setIsDirty(false);
    };

    worker.onerror = (err) => {
      console.error('Worker failed critically:', err);
      setLoading(false);
    };

    worker.postMessage(data);

    return () => worker.terminate();
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setIsDirty(true);
  }, [data]);

  const handleRecalculate = () => {
    if (workerRef.current) {
      setLoading(true);
      workerRef.current.postMessage(data);
    }
  };

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert('Settings persisted to local storage.');
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-plan.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setData(imported);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const addItem = (type) => {
    let newItem;
    if (type === 'portfolio') {
      if (data.portfolio.length >= 10) return alert('Maximum of 10 investments allowed.');
      newItem = { id: Date.now(), symbol: 'VOO', name: 'Vanguard S&P 500', percent: 0, yield: 15.6 };
    } else {
      newItem = { id: Date.now(), name: '', amount: 0, frequency: 'monthly', date: data.planStartDate };
    }
    setData(prev => ({ ...prev, [type]: [...prev[type], newItem] }));
  };

  const updateItem = (type, id, field, value) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (type, id) => {
    setData(prev => ({ ...prev, [type]: prev[type].filter(item => item.id !== id) }));
  };

  const chartData = useMemo(() => ({
    labels: dailyData.map(d => d.date),
    datasets: [
      {
        label: 'Cumulative Balance',
        data: dailyData.map(d => d.balance),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        yAxisID: 'y',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 3,
      },
      {
        label: 'Daily Expenses',
        data: dailyData.map(d => d.expenses),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.4)',
        type: 'line',
        pointRadius: dailyData.map(d => d.expenses > 0 ? 3 : 0),
        yAxisID: 'y1',
        borderWidth: 1,
        showLine: false,
      },
      {
        label: 'Daily Income',
        data: dailyData.map(d => d.compensation),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.4)',
        type: 'line',
        pointRadius: dailyData.map(d => d.compensation > 0 ? 3 : 0),
        yAxisID: 'y1',
        borderWidth: 1,
        showLine: false,
      },
      {
        label: 'Invested Balance',
        data: dailyData.map(d => d.investedBalance),
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        yAxisID: 'y',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Emergency Fund',
        data: dailyData.map(d => d.emergencyFund),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderDash: [2, 2],
        yAxisID: 'y',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      }
    ]
  }), [dailyData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: { 
      mode: null, // Disable default hover interaction
    },
    onClick: (e, elements, chart) => {
      // Manually trigger tooltip on click
      const activeElements = chart.getElementsAtEventForMode(e, 'index', { intersect: false }, true);
      chart.setActiveElements(activeElements);
      chart.tooltip.setActiveElements(activeElements, { x: e.x, y: e.y });
      chart.update();
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: data.yAxisMin0 ? 0 : undefined,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        title: { display: true, text: 'Balance ($)', font: { weight: 'bold' } }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Daily Transactions ($)', font: { weight: 'bold' } }
      },
      x: {
        type: 'category',
        grid: { display: true, color: 'rgba(0, 0, 0, 0.05)', drawOnChartArea: true },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
          padding: 10,
          font: { size: 10, weight: '500' },
          callback: function(val) {
            const dateStr = this.getLabelForValue(val);
            const [y, m, d] = dateStr.split('-');
            return `${m}-${d}-${y.slice(-2)}`;
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const index = context[0].dataIndex;
            const day = dailyData[index];
            if (!day || !day.details) return '';
            let lines = [];
            if (day.details.income.length > 0) {
              lines.push('\nIncome:');
              day.details.income.forEach(item => lines.push(` • ${item.name}: $${item.amount.toLocaleString()}`));
            }
            if (day.details.expenses.length > 0) {
              lines.push('\nExpenses:');
              day.details.expenses.forEach(item => lines.push(` • ${item.name}: $${item.amount.toLocaleString()}`));
            }
            lines.push(`\nBreakdown:`);
            lines.push(` • Emergency Fund: $${Math.round(day.emergencyFund).toLocaleString()}`);
            lines.push(` • Invested: $${Math.round(day.investedBalance).toLocaleString()}`);
            return lines.join('\n');
          }
        }
      },
      legend: {
        position: 'top',
        labels: { usePointStyle: true, boxWidth: 6, font: { size: 12, weight: '500' } }
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                <Wallet className="text-white" size={28} />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">FinPlanner</h1>
                <p className="text-slate-500 font-medium text-sm">Automated financial forecasting</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={importData} 
                className="hidden" 
                accept=".json"
              />
             <button 
                onClick={() => fileInputRef.current.click()}
                className="flex-1 sm:flex-none bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold shadow-sm active:scale-95"
              >
                <Upload size={18} /> Import
              </button>
             <button 
                onClick={exportData}
                className="flex-1 sm:flex-none bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold shadow-sm active:scale-95"
              >
                <Download size={18} /> Export
              </button>
              <button 
                onClick={saveData}
                className="flex-1 sm:flex-none bg-slate-900 text-white px-7 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 shadow-md shadow-slate-200 transition-all font-semibold active:scale-95"
              >
                <Save size={18} /> Save Plan
              </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            
            {/* Global Settings */}
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden relative">
              <div className="flex items-center gap-2 mb-6 text-left">
                 <Settings2 className="text-blue-500" size={20} />
                 <h2 className="text-lg font-bold text-slate-800">Parameters</h2>
              </div>
              <div className="space-y-5">
                <div className="text-left">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Plan Timeline Start</label>
                  <input 
                    type="date" 
                    value={data.planStartDate}
                    onChange={e => setData(prev => ({ ...prev, planStartDate: e.target.value }))}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all border"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Opening Balance ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      value={data.beginBalance === 0 ? '' : data.beginBalance}
                      onFocus={(e) => e.target.select()}
                      onChange={e => setData(prev => ({ ...prev, beginBalance: parseFloat(e.target.value) || 0 }))}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 pl-8 pr-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all border"
                    />
                  </div>
                </div>
                <div className="text-left">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Emergency Reserve ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      value={data.reserveAmount === 0 ? '' : data.reserveAmount}
                      onFocus={(e) => e.target.select()}
                      onChange={e => setData(prev => ({ ...prev, reserveAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 pl-8 pr-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all border"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 ml-1 italic">Cash remains uninvested (0% growth)</p>
                </div>
                <div className="flex items-center justify-between py-2 px-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Y-Axis Min 0</label>
                  <button 
                    onClick={() => setData(prev => ({ ...prev, yAxisMin0: !prev.yAxisMin0 }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${data.yAxisMin0 ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${data.yAxisMin0 ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>

            <ItemSection 
              title="Compensation" 
              items={data.compensation} 
              type="compensation"
              onAdd={() => addItem('compensation')}
              onUpdate={updateItem}
              onRemove={removeItem}
              icon={<ArrowUpCircle className="text-emerald-500" size={20} />}
            />

            <ItemSection 
              title="Expenses" 
              items={data.expenses} 
              type="expenses"
              onAdd={() => addItem('expenses')}
              onUpdate={updateItem}
              onRemove={removeItem}
              icon={<ArrowDownCircle className="text-rose-500" size={20} />}
            />

            <PortfolioSection 
              items={data.portfolio}
              onAdd={() => addItem('portfolio')}
              onUpdate={updateItem}
              onRemove={removeItem}
            />
          </aside>

          {/* Main Visualizer */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* Chart Container */}
            <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 h-[650px] relative overflow-hidden group text-left">
               {(loading || isDirty) && (
                 <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20 transition-all">
                   {loading ? (
                     <div className="flex flex-col items-center gap-4">
                       <div className="w-12 h-12 border-[5px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-sm font-black text-slate-700 tracking-tighter uppercase italic">Forecasting...</span>
                     </div>
                   ) : (
                     <button 
                        onClick={handleRecalculate}
                        className="flex flex-col items-center gap-4 group/btn hover:scale-105 transition-transform"
                     >
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover/btn:bg-blue-700 transition-colors">
                            <RefreshCw size={40} className="group-active/btn:rotate-180 transition-transform duration-500" />
                        </div>
                        <div className="text-center">
                            <span className="block text-lg font-black text-slate-900 uppercase tracking-tighter">Recalculate Forecast</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Parameters have changed</span>
                        </div>
                     </button>
                   )}
                 </div>
               )}
               <div className="h-full w-full">
                  <Line data={chartData} options={chartOptions} />
               </div>
               
               {/* Chart Help Overlay */}
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-slate-900/90 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest backdrop-blur-sm shadow-xl">
                    Wheel to zoom • Drag to pan
                  </div>
               </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard 
                title="Year-End Balance" 
                value={dailyData[dailyData.length-1]?.balance} 
                color="text-blue-600" 
                trend={dailyData.length > 0 && data.beginBalance > 0 ? (((dailyData[dailyData.length-1]?.balance / data.beginBalance) - 1) * 100) : 0}
              />
              <SummaryCard 
                title="Gross Income" 
                value={dailyData.reduce((acc, curr) => acc + curr.compensation, 0)} 
                color="text-emerald-600" 
              />
              <SummaryCard 
                title="Total Expenses" 
                value={dailyData.reduce((acc, curr) => acc + curr.expenses, 0)} 
                color="text-rose-600" 
              />
            </div>

            {/* Data Table */}
            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden relative">
               {(loading || isDirty) && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 text-left">
                    <button 
                      onClick={handleRecalculate}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                    >
                      Update Ledger
                    </button>
                 </div>
               )}
               <div className="p-6 border-b border-slate-100 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <TableIcon className="text-slate-400" size={20} />
                    <h2 className="text-lg font-bold text-slate-800">Forecast Ledger</h2>
                  </div>
               </div>
               <div className="max-h-[400px] overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Net</th>
                        <th className="px-6 py-4 text-right">Total Balance</th>
                        <th className="px-6 py-4 text-right">Emergency Fund</th>
                        <th className="px-6 py-4 text-right text-purple-600">Invested</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium divide-y divide-slate-50">
                      {dailyData.filter(d => d.compensation > 0 || d.expenses > 0 || d.date.endsWith('-01')).map((day, i) => (
                        <tr key={day.date} className={day.date.endsWith('-01') ? 'bg-blue-50/30' : 'hover:bg-slate-50/50 transition-colors'}>
                          <td className="px-6 py-3 font-bold text-slate-600">{day.date}</td>
                          <td className={`px-6 py-3 text-right font-black ${day.net > 0 ? 'text-emerald-600' : day.net < 0 ? 'text-rose-600' : 'text-slate-300'}`}>
                            {day.net > 0 ? `+$${day.net.toLocaleString()}` : day.net < 0 ? `-$${Math.abs(day.net).toLocaleString()}` : '—'}
                          </td>
                          <td className="px-6 py-3 text-right font-black text-slate-900">${Math.round(day.balance).toLocaleString()}</td>
                          <td className="px-6 py-3 text-right font-bold text-amber-600">${Math.round(day.emergencyFund).toLocaleString()}</td>
                          <td className="px-6 py-3 text-right font-black text-purple-600">${Math.round(day.investedBalance).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               <div className="p-4 bg-slate-50 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest border-t border-slate-100">
                  Showing transactions and start of months
               </div>
            </section>

            <div className="bg-slate-100/50 border border-slate-200 p-6 rounded-[2rem] text-sm text-slate-600 leading-relaxed text-left">
               <div className="flex gap-3">
                  <div className="bg-slate-200 p-1.5 rounded-lg h-fit mt-0.5">
                    <Settings2 size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 mb-1">Architecture Note</p>
                    <p>This SPA runs entirely in your browser using <strong>Web Workers</strong> for heavy arithmetic. No data ever leaves your machine; everything is stored in your local <code>IndexDB/LocalStorage</code>. You can export your data anytime as a portable JSON file.</p>
                  </div>
               </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const ItemSection = memo(({ title, items, type, onAdd, onUpdate, onRemove, icon }) => (
  <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col h-fit max-h-[600px] text-left">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">{icon}<h2 className="text-lg font-bold text-slate-800">{title}</h2></div>
      <button onClick={onAdd} className="text-white bg-slate-900 p-2 rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-90"><Plus size={18} /></button>
    </div>
    <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar">
      {items.length === 0 && (<div className="flex flex-col items-center justify-center py-12 text-center opacity-40"><Plus size={32} className="mb-2" /><p className="text-xs font-bold uppercase tracking-widest">Add {title}</p></div>)}
      {items.map(item => (<TransactionItem key={item.id} item={item} type={type} onUpdate={onUpdate} onRemove={onRemove} title={title} />))}
    </div>
  </section>
));

const TransactionItem = memo(({ item, type, onUpdate, onRemove, title }) => {
  const [localName, setLocalName] = useState(item.name);
  const [localAmount, setLocalAmount] = useState(item.amount);
  useEffect(() => { setLocalName(item.name); setLocalAmount(item.amount); }, [item.name, item.amount]);
  return (
    <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/50 space-y-4 relative group hover:border-blue-200 transition-colors text-left">
      <button onClick={() => onRemove(type, item.id)} className="absolute top-3 right-3 text-gray-300 hover:text-rose-500 transition-opacity opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
      <input placeholder={`${title} Name...`} value={localName} onChange={e => setLocalName(e.target.value)} onBlur={() => onUpdate(type, item.id, 'name', localName)} className="w-full bg-transparent font-bold text-sm focus:outline-none border-b border-transparent focus:border-blue-400 pb-1" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[9px] uppercase text-slate-400 font-bold tracking-widest ml-1">Amount</label>
          <input type="number" value={localAmount === 0 ? '' : localAmount} onFocus={(e) => e.target.select()} onChange={e => setLocalAmount(parseFloat(e.target.value) || 0)} onBlur={() => onUpdate(type, item.id, 'amount', localAmount)} className="mt-1 w-full bg-white rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all border" />
        </div>
        <div>
          <label className="text-[9px] uppercase text-slate-400 font-bold tracking-widest ml-1">Frequency</label>
          <select value={item.frequency} onChange={e => onUpdate(type, item.id, 'frequency', e.target.value)} className="mt-1 w-full bg-white rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none border">{FREQUENCIES.map(f => (<option key={f.value} value={f.value}>{f.label}</option>))}</select>
        </div>
        <div className="col-span-2 text-left">
          <label className="text-[9px] uppercase text-slate-400 font-bold tracking-widest ml-1">Start Date</label>
          <input type="date" value={item.date} onChange={e => onUpdate(type, item.id, 'date', e.target.value)} className="mt-1 w-full bg-white rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all border" />
        </div>
      </div>
    </div>
  );
});

const SummaryCard = memo(({ title, value, color, trend }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col items-center justify-center relative overflow-hidden">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
    <p className={`text-3xl font-black ${color} tracking-tighter`}>${Math.round(value || 0).toLocaleString()}</p>
    {trend !== undefined && (<span className={`text-[9px] font-bold mt-2 px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}% Growth</span>)}
  </div>
));

const PortfolioSection = memo(({ items = [], onAdd, onUpdate, onRemove }) => {
  const totalAlloc = (items || []).reduce((acc, inv) => acc + (parseFloat(inv.percent) || 0), 0);
  const handleFundChange = (id, symbol) => {
    const fund = VANGUARD_FUNDS.find(f => f.symbol === symbol);
    onUpdate('portfolio', id, 'symbol', symbol);
    onUpdate('portfolio', id, 'name', fund.name);
    onUpdate('portfolio', id, 'yield', fund.yield);
  };
  return (
    <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col h-fit max-h-[600px] text-left">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2"><TrendingUp className="text-blue-500" size={20} /><h2 className="text-lg font-bold text-slate-800">Portfolio</h2></div>
        <button onClick={onAdd} className="text-white bg-slate-900 p-2 rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-90"><Plus size={18} /></button>
      </div>
      <div className="mb-4 px-1 text-left">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1"><span>Allocation</span><span className={totalAlloc === 100 ? 'text-emerald-500' : 'text-rose-500'}>{totalAlloc}% / 100%</span></div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden text-left"><div className={`h-full transition-all ${totalAlloc === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, totalAlloc)}%` }} /></div>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar text-left">
        {items.length === 0 && (<div className="flex flex-col items-center justify-center py-12 text-center opacity-40"><BarChart3 size={32} className="mb-2" /><p className="text-xs font-bold uppercase tracking-widest">Setup Assets</p></div>)}
        {items.map(inv => (<PortfolioItem key={inv.id} inv={inv} onUpdate={onUpdate} onRemove={onRemove} handleFundChange={handleFundChange} />))}
      </div>
    </section>
  );
});

const PortfolioItem = memo(({ inv, onUpdate, onRemove, handleFundChange }) => {
  const [localPercent, setLocalPercent] = useState(inv.percent);
  const [localYield, setLocalYield] = useState(inv.yield);
  useEffect(() => { setLocalPercent(inv.percent); setLocalYield(inv.yield); }, [inv.percent, inv.yield]);
  return (
    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/50 space-y-3 relative group hover:border-blue-200 transition-colors text-left">
      <button onClick={() => onRemove('portfolio', inv.id)} className="absolute top-2 right-2 text-gray-300 hover:text-rose-500 transition-opacity opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
      <div className="grid grid-cols-1 gap-3">
        <div className="text-left">
          <label className="text-[9px] uppercase text-slate-400 font-bold tracking-widest ml-1 text-left">Vanguard Fund</label>
          <select value={inv.symbol} onChange={e => handleFundChange(inv.id, e.target.value)} className="mt-1 w-full bg-white rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none border">{VANGUARD_FUNDS.map(f => (<option key={f.symbol} value={f.symbol}>{f.symbol} — {f.name}</option>))}</select>
        </div>
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="text-left">
            <label className="text-[9px] uppercase text-slate-400 font-bold tracking-widest ml-1 text-left">Allocation %</label>
            <input type="number" value={localPercent === 0 ? '' : localPercent} onFocus={(e) => e.target.select()} onChange={e => setLocalPercent(parseFloat(e.target.value) || 0)} onBlur={() => onUpdate('portfolio', inv.id, 'percent', localPercent)} className="mt-1 w-full bg-white rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all border" />
          </div>
          <div className="text-left">
            <label className="text-[9px] uppercase text-slate-400 font-bold tracking-widest ml-1 text-left">Exp. Yield %</label>
            <input type="number" value={localYield === 0 ? '' : localYield} onFocus={(e) => e.target.select()} onChange={e => setLocalYield(parseFloat(e.target.value) || 0)} onBlur={() => onUpdate('portfolio', inv.id, 'yield', localYield)} className="mt-1 w-full bg-white rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all border" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default App;
