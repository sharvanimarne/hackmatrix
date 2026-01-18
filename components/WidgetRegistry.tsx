import React, { useEffect, useState, useRef } from 'react';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { ApiService } from '../services/apiService';
import { FinanceData, Habit, JournalEntry, UserProfile, Subscription } from '../types';
import { Button, Input, Badge } from '../components/UIComponents';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Wallet, CheckSquare, Smile, ArrowUpRight, ArrowDownLeft, Save, Plus, Trash, Brain, Sparkles, Palette, Bell, Trash2, Droplets, Moon, Clock, Play, Pause, RotateCcw, Wind, Quote, Target, CreditCard, Heart, Grid, Minus, Activity, Shield, Lock, Check, Edit2 } from 'lucide-react';

// --- DASHBOARD WIDGETS ---

export const WalletWidget: React.FC = () => {
  const [finances, setFinances] = useState<FinanceData[]>([]);
  
  const load = async () => {
    const data = await StorageService.loadFinances();
    setFinances(data);
  };

  useEffect(() => { 
    load();
    window.addEventListener('finance-update', load);
    return () => window.removeEventListener('finance-update', load);
  }, []);
  
  const income = finances.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = finances.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  return (
    <div className="flex flex-col justify-center h-full w-full">
       <div className="space-y-4">
          <div className="flex items-center gap-2 text-tui-subtext mb-2">
             <Palette size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Interface Theme</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {themes.map((theme) => (
                <button 
                   key={theme.id} 
                   onClick={() => handleThemeSelect(theme.id)} 
                   className={`p-4 border-2 flex flex-col items-center justify-center gap-3 transition-all ${currentTheme === theme.id ? 'border-tui-mauve bg-tui-surface' : 'border-tui-overlay hover:border-tui-subtext hover:bg-tui-surface'}`}
                >
                   <span className={`font-bold text-sm ${currentTheme === theme.id ? 'text-tui-mauve' : 'text-tui-text'}`}>
                      {theme.name.toUpperCase()}
                   </span>
                </button>
             ))}
          </div>
       </div>

       <div className="space-y-4 border border-tui-overlay p-4 bg-tui-surface">
         <div className="flex items-center gap-2 text-tui-subtext mb-2">
            <Lock size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Access Control</span>
         </div>
         <form onSubmit={handleChangePassword} className="space-y-2">
            <Input type="password" placeholder="Current Password" value={passwordForm.old} onChange={e => setPasswordForm({...passwordForm, old: e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
               <Input type="password" placeholder="New Password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} />
               <Input type="password" placeholder="Confirm New" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} />
            </div>
            <div className="flex justify-between items-center">
               <span className={`text-xs ${passMsg.includes('Error') ? 'text-tui-red' : 'text-tui-green'}`}>{passMsg}</span>
               <Button type="submit" variant="primary">UPDATE KEY</Button>
            </div>
         </form>
       </div>

       <div className="space-y-4 border border-tui-overlay p-4 bg-tui-surface">
         <div className="flex items-center gap-2 text-tui-subtext mb-2">
            <Shield size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Data Management</span>
         </div>
         <div className="space-y-2">
            <Button onClick={handleExportData} variant="secondary" className="w-full">
               📥 EXPORT ALL DATA
            </Button>
            <Button onClick={handleLogout} variant="danger" className="w-full">
               🚪 LOGOUT
            </Button>
         </div>
       </div>
     </div>
   );
};
// flex items-center justify-between">
//           <div>
//              <div className="text-2xl md:text-3xl font-bold text-tui-green mb-1">Rs {balance.toLocaleString()}</div>
//              <div className="text-xs text-tui-subtext">Net Available</div>
//           </div>
//           <div className="p-3 bg-tui-surface border-2 border-tui-green rounded-full shrink-0">
//              <Wallet className="text-tui-green" />
//           </div>
//        </div>
//     </div>
//   );
// };

export const HabitStatsWidget: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  
  const load = async () => {
    const data = await StorageService.loadHabits();
    setHabits(data);
  };
  
  useEffect(() => { 
    load();
    window.addEventListener('habit-update', load);
    return () => window.removeEventListener('habit-update', load);
  }, []);

  const activeHabits = habits.length;
  const completedToday = habits.filter(h => h.lastCompletedDate && new Date(h.lastCompletedDate).toDateString() === new Date().toDateString()).length;
  const focusScore = activeHabits > 0 ? Math.round((completedToday / activeHabits) * 100) : 0;

  return (
    <div className="flex flex-col justify-center h-full w-full">
       <div className="flex items-center justify-between">
          <div>
             <div className="text-2xl md:text-3xl font-bold text-tui-blue mb-1">{focusScore}%</div>
             <div className="text-xs text-tui-subtext">Daily Completion</div>
          </div>
          <div className="p-3 bg-tui-surface border-2 border-tui-blue rounded-full shrink-0">
             <CheckSquare className="text-tui-blue" />
          </div>
       </div>
    </div>
  );
};

export const MoodStatsWidget: React.FC = () => {
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  
  const load = async () => {
    const data = await StorageService.loadJournal();
    setJournal(data);
  };

  useEffect(() => { 
     load();
     window.addEventListener('journal-update', load);
     return () => window.removeEventListener('journal-update', load);
  }, []);
  
  return (
    <div className="flex flex-col justify-center h-full w-full">
       <div className="flex items-center justify-between">
          <div>
             <div className="text-2xl md:text-3xl font-bold text-tui-mauve mb-1">{journal.length > 0 ? journal[0].mood : '-'} <span className="text-base text-tui-subtext">/ 5</span></div>
             <div className="text-xs text-tui-subtext">Latest Entry Logged</div>
          </div>
          <div className="p-3 bg-tui-surface border-2 border-tui-mauve rounded-full shrink-0">
             <Smile className="text-tui-mauve" />
          </div>
       </div>
    </div>
  );
};

export const HydrationWidget: React.FC = () => {
   const [water, setWater] = useState(0);
   const [goal] = useState(8);
   
   const load = () => {
      const cups = StorageService.getHydrationToday();
      setWater(cups);
   };

   useEffect(() => {
      load();
      window.addEventListener('hydration-update', load);
      return () => window.removeEventListener('hydration-update', load);
   }, []);

   const addWater = async () => {
      const newVal = water + 1;
      setWater(newVal);
      await StorageService.saveHydrationToday(newVal);
      window.dispatchEvent(new Event('hydration-update'));
   };

   const removeWater = async () => {
      const newVal = Math.max(0, water - 1);
      setWater(newVal);
      await StorageService.saveHydrationToday(newVal);
      window.dispatchEvent(new Event('hydration-update'));
   };

   return (
      <div className="h-full flex flex-col justify-center">
         <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
               {Array.from({length: goal}).map((_, i) => (
                  <div key={i} className={`w-6 h-8 border-2 ${i < water ? 'bg-tui-blue border-tui-blue' : 'border-tui-overlay'} transition-all`}></div>
               ))}
            </div>
            <Droplets className="text-tui-blue" size={20} />
         </div>
         <div className="flex justify-between items-center">
            <span className="text-xs text-tui-subtext">{water} / {goal} CUPS</span>
            <div className="flex gap-1">
               <button onClick={removeWater} className="p-1 border border-tui-overlay hover:border-tui-red text-tui-red"><Minus size={14}/></button>
               <button onClick={addWater} className="p-1 bg-tui-blue border border-tui-blue text-tui-base hover:bg-tui-blue/80"><Plus size={14}/></button>
            </div>
         </div>
      </div>
   );
};

export const SleepWidget: React.FC = () => {
   const [hours, setHours] = useState('');
   const [savedHours, setSavedHours] = useState<number | null>(null);

   const load = async () => {
      const h = await StorageService.getLatestSleep();
      if (h) setSavedHours(h);
   };

   useEffect(() => {
      load();
   }, []);

   const saveSleep = async () => {
      if (!hours) return;
      try {
         await StorageService.saveSleep(parseFloat(hours));
         setSavedHours(parseFloat(hours));
         setHours('');
      } catch (error) {
         console.error('Failed to save sleep:', error);
      }
   };

   const clearSleep = async () => {
      // In backend version, we don't delete - just clear the local state
      setSavedHours(null);
      window.dispatchEvent(new Event('sleep-update'));
   };

   return (
      <div className="h-full flex flex-col justify-center">
         {savedHours ? (
            <div className="flex items-center justify-between">
               <div>
                  <div className="text-2xl md:text-3xl font-bold text-tui-mauve mb-1">{savedHours}h</div>
                  <div className="text-xs text-tui-subtext">Rest Cycle Recorded</div>
               </div>
               <div className="p-3 bg-tui-surface border-2 border-tui-mauve rounded-full shrink-0 cursor-pointer" onClick={clearSleep}>
                  <Moon className="text-tui-mauve" />
               </div>
            </div>
         ) : (
            <div className="flex items-center gap-2">
               <Input 
                  type="number" 
                  value={hours} 
                  onChange={(e) => setHours(e.target.value)} 
                  placeholder="Hrs slept..." 
                  className="w-full"
                  step="0.5"
               />
               <Button onClick={saveSleep} variant="secondary" className="px-2"><Save size={16}/></Button>
            </div>
         )}
      </div>
   );
};

export const TimerWidget: React.FC = () => {
   const [initialMinutes, setInitialMinutes] = useState(25);
   const [time, setTime] = useState(25 * 60);
   const [isActive, setIsActive] = useState(false);
   const intervalRef = useRef<number | null>(null);

   const toggleTimer = () => setIsActive(!isActive);
   
   const resetTimer = () => { 
      setIsActive(false); 
      setTime(initialMinutes * 60); 
   };

   const adjustTime = (delta: number) => {
      if (isActive) return;
      const newMins = Math.max(1, initialMinutes + delta);
      setInitialMinutes(newMins);
      setTime(newMins * 60);
   };

   useEffect(() => {
      if (isActive) {
         intervalRef.current = window.setInterval(() => {
            setTime((t) => (t > 0 ? t - 1 : 0));
         }, 1000);
      } else if (intervalRef.current) {
         window.clearInterval(intervalRef.current);
      }
      return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
   }, [isActive]);

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   return (
      <div className="h-full flex flex-col justify-center">
         <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <div className="font-mono text-3xl font-bold text-tui-yellow tracking-widest leading-none">
                  {formatTime(time)}
               </div>
               {!isActive && (
                  <div className="flex gap-2 mt-1">
                     <button onClick={() => adjustTime(-5)} className="text-xs text-tui-subtext hover:text-tui-text bg-tui-surface px-1 border border-tui-overlay">-5</button>
                     <button onClick={() => adjustTime(-1)} className="text-xs text-tui-subtext hover:text-tui-text bg-tui-surface px-1 border border-tui-overlay">-1</button>
                     <button onClick={() => adjustTime(1)} className="text-xs text-tui-subtext hover:text-tui-text bg-tui-surface px-1 border border-tui-overlay">+1</button>
                     <button onClick={() => adjustTime(5)} className="text-xs text-tui-subtext hover:text-tui-text bg-tui-surface px-1 border border-tui-overlay">+5</button>
                  </div>
               )}
            </div>
            
            <div className="flex gap-1 shrink-0">
               <button onClick={toggleTimer} className={`p-2 border-2 rounded ${isActive ? 'border-tui-yellow text-tui-yellow' : 'border-tui-green text-tui-green bg-tui-surface'}`}>
                  {isActive ? <Pause size={16} /> : <Play size={16} />}
               </button>
               <button onClick={resetTimer} className="p-2 border-2 border-tui-red text-tui-red rounded bg-tui-surface">
                  <RotateCcw size={16} />
               </button>
            </div>
         </div>
      </div>
   );
};

export const BreathingWidget: React.FC = () => {
   const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
   const [scale, setScale] = useState(1);

   useEffect(() => {
      const cycle = async () => {
         while(true) {
            setPhase('Inhale'); setScale(1.5);
            await new Promise(r => setTimeout(r, 4000));
            setPhase('Hold');
            await new Promise(r => setTimeout(r, 4000));
            setPhase('Exhale'); setScale(1);
            await new Promise(r => setTimeout(r, 4000));
         }
      };
      cycle();
   }, []);

   return (
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
         <div 
            className="w-16 h-16 rounded-full border-4 border-tui-blue opacity-50 absolute transition-transform duration-[4000ms] ease-in-out"
            style={{ transform: `scale(${scale})` }}
         ></div>
         <div 
             className="w-12 h-12 rounded-full bg-tui-blue/20 flex items-center justify-center z-10 transition-transform duration-[4000ms] ease-in-out"
             style={{ transform: `scale(${scale * 0.8})` }}
         >
             <Wind size={20} className="text-tui-blue" />
         </div>
         <div className="mt-8 font-bold text-tui-text uppercase tracking-widest">{phase}</div>
      </div>
   );
};

export const QuoteWidget: React.FC = () => {
   const quotes = [
      "The obstacle is the way.",
      "Waste no more time arguing what a good man should be. Be one.",
      "He who has a why to live can bear almost any how.",
      "Discipline is freedom.",
      "Simplicity is the ultimate sophistication."
   ];
   const [quote, setQuote] = useState(quotes[0]);

   useEffect(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
   }, []);

   return (
      <div className="h-full flex flex-col justify-center text-center p-2">
         <Quote size={16} className="text-tui-subtext mx-auto mb-2 opacity-50" />
         <p className="text-sm font-mono text-tui-text italic">"{quote}"</p>
      </div>
   );
};

export const WellnessChecklistWidget: React.FC = () => {
   const [items, setItems] = useState<string[]>([]);
   const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
   const [isEditing, setIsEditing] = useState(false);
   const [newItem, setNewItem] = useState('');
   
   const dateKey = new Date().toISOString().split('T')[0];

   const load = async () => {
      const config = await StorageService.loadWellnessConfig();
      setItems(config);
      setCheckedState(StorageService.getWellnessState(dateKey));
   };

   useEffect(() => {
      load();
   }, [dateKey]);

   const toggle = async (item: string) => {
      const newState = { ...checkedState, [item]: !checkedState[item] };
      setCheckedState(newState);
      await StorageService.saveWellnessState(dateKey, newState);
   };

   const handleAddItem = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newItem.trim()) return;
      const newItems = [...items, newItem];
      setItems(newItems);
      await StorageService.saveWellnessConfig(newItems);
      setNewItem('');
   };

   const deleteItem = async (itemToDelete: string) => {
      if (!confirm(`Delete "${itemToDelete}"?`)) return;
      const newItems = items.filter(i => i !== itemToDelete);
      setItems(newItems);
      await StorageService.saveWellnessConfig(newItems);
   };

   return (
      <div className="h-full flex flex-col">
         <div className="flex items-center justify-between mb-3 pb-2 border-b border-tui-overlay shrink-0">
            <div className="flex items-center gap-2">
               <Activity size={16} className="text-tui-green" />
               <span className="text-xs font-bold text-tui-subtext uppercase">Daily Protocols</span>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className={`text-xs p-1 hover:text-tui-mauve ${isEditing ? 'text-tui-mauve' : 'text-tui-subtext'}`}>
               <Edit2 size={12} />
            </button>
         </div>
         
         <div className="flex-1 overflow-auto custom-scrollbar space-y-2 mb-2">
            {items.map(item => (
               <div key={item} className="flex justify-between items-center group p-1 hover:bg-tui-surface rounded transition-colors">
                  <div onClick={() => !isEditing && toggle(item)} className={`flex items-center gap-3 cursor-pointer flex-1 ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
                     <div className={`w-4 h-4 border-2 flex items-center justify-center ${checkedState[item] ? 'bg-tui-green border-tui-green' : 'border-tui-subtext group-hover:border-tui-mauve'}`}>
                        {checkedState[item] && <Check size={12} className="text-tui-base" />}
                     </div>
                     <span className={`text-sm ${checkedState[item] ? 'text-tui-subtext line-through' : 'text-tui-text'}`}>{item}</span>
                  </div>
                  {isEditing && (
                     <button onClick={() => deleteItem(item)} className="text-tui-red hover:text-tui-text p-1">
                        <Trash size={12} />
                     </button>
                  )}
               </div>
            ))}
            {items.length === 0 && <div className="text-xs text-tui-subtext italic">No protocols defined.</div>}
         </div>

         {isEditing && (
            <form onSubmit={handleAddItem} className="flex gap-2 shrink-0 pt-2 border-t border-tui-overlay">
               <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="New Protocol..." className="h-8 text-xs" />
               <Button type="submit" variant="secondary" className="px-2 h-[34px]"><Plus size={14}/></Button>
            </form>
         )}
      </div>
   );
};

export const RecentTransactionsWidget: React.FC = () => {
   const [transactions, setTransactions] = useState<FinanceData[]>([]);
   
   const load = async () => {
      const all = await StorageService.loadFinances();
      setTransactions(all.slice(0, 5)); 
   };

   useEffect(() => {
      load();
      window.addEventListener('finance-update', load);
      return () => window.removeEventListener('finance-update', load);
   }, []);

   return (
      <div className="h-full overflow-auto custom-scrollbar">
         <div className="flex items-center gap-2 mb-3 pb-2 border-b border-tui-overlay">
            <CreditCard size={16} className="text-tui-yellow" />
            <span className="text-xs font-bold text-tui-subtext uppercase">Recent Activity</span>
         </div>
         <div className="space-y-2">
            {transactions.map(tx => (
               <div key={tx.id} className="flex justify-between items-center text-sm p-1 hover:bg-tui-surface">
                  <div className="flex flex-col">
                     <span className="font-bold text-tui-text">{tx.category}</span>
                     <span className="text-[10px] text-tui-subtext">{new Date(tx.date).toLocaleDateString()}</span>
                  </div>
                  <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-tui-green' : 'text-tui-red'}`}>
                     {tx.type === 'income' ? '+' : '-'}Rs {tx.amount.toFixed(2)}
                  </span>
               </div>
            ))}
            {transactions.length === 0 && <div className="text-xs text-tui-subtext italic">No recent activity.</div>}
         </div>
      </div>
   );
};

export const ChartWidget: React.FC = () => {
  const [data, setData] = useState<{name: string, value: number}[]>([]);

  const calculateData = async () => {
    const finances = await StorageService.loadFinances();
    const sorted = [...finances].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const result = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        const txsUntilToday = sorted.filter(tx => new Date(tx.date) <= new Date(d.setHours(23,59,59,999)));
        const inc = txsUntilToday.filter(t => t.type === 'income').reduce((a,b) => a+b.amount, 0);
        const exp = txsUntilToday.filter(t => t.type === 'expense').reduce((a,b) => a+b.amount, 0);
        result.push({ name: days[d.getDay()], value: inc - exp });
    }
    setData(result);
  };

  useEffect(() => {
     calculateData();
     window.addEventListener('finance-update', calculateData);
     return () => window.removeEventListener('finance-update', calculateData);
  }, []);

  return (
    <div className="w-full h-full min-h-[100px]">
       <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
             <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#cba6f7" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#cba6f7" stopOpacity={0}/>
                </linearGradient>
             </defs>
             <XAxis dataKey="name" stroke="#a6adc8" fontSize={12} tickLine={false} axisLine={false} />
             <YAxis stroke="#a6adc8" fontSize={12} tickLine={false} axisLine={false} />
             <Tooltip 
                contentStyle={{ backgroundColor: '#1e1e2e', border: '2px solid #313244', borderRadius: '0px' }}
                itemStyle={{ color: '#cba6f7' }}
                formatter={(value: number) => [`Rs ${value.toLocaleString()}`, 'Balance']}
             />
             <Area type="monotone" dataKey="value" stroke="#cba6f7" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
       </ResponsiveContainer>
    </div>
  );
};

export const TasksWidget: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  
  const load = async () => {
    const data = await StorageService.loadHabits();
    setHabits(data);
  };

  useEffect(() => { 
     load(); 
     window.addEventListener('habit-update', load);
     return () => window.removeEventListener('habit-update', load);
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0">
       <div className="space-y-2 flex-1 overflow-auto custom-scrollbar pr-1">
          {habits.map(h => (
             <div key={h.id} className="flex items-center justify-between p-2 bg-tui-surface border border-tui-overlay hover:border-tui-blue transition-colors cursor-pointer">
                <span className="text-sm font-bold text-tui-text truncate">{h.name}</span>
                <Badge variant={h.streak > 3 ? 'success' : 'neutral'}>{h.streak}d</Badge>
             </div>
          ))}
          {habits.length === 0 && <div className="text-center text-tui-subtext py-4">No active tasks.</div>}
       </div>
       <div className="mt-2 pt-2 border-t-2 border-tui-overlay shrink-0">
          <div className="text-xs text-tui-subtext bg-tui-surface p-2 border border-tui-overlay">
            {"> Sys Check: OK"}<br />
            {"> Sync: Pending"}
          </div>
       </div>
    </div>
  );
};

// --- FINANCE WIDGETS ---

export const FinanceFormWidget: React.FC = () => {
  const [formData, setFormData] = useState({ 
    amount: '', 
    category: '', 
    type: 'expense', 
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) return;
    
    try {
      await StorageService.addFinance({
        type: formData.type as 'income' | 'expense',
        amount: parseFloat(formData.amount),
        category: formData.category,
        notes: formData.notes,
        date: new Date(formData.date).toISOString()
      });
      window.dispatchEvent(new Event('finance-update'));
      setFormData({ amount: '', category: '', type: 'expense', notes: '', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Failed to add finance:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col overflow-auto custom-scrollbar p-1">
       <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
             <button type="button" onClick={() => setFormData({...formData, type: 'expense'})}
                className={`py-2 text-sm font-bold border-2 ${formData.type === 'expense' ? 'bg-tui-red border-tui-red text-tui-base' : 'border-tui-overlay text-tui-subtext'}`}>
                EXPENSE
             </button>
             <button type="button" onClick={() => setFormData({...formData, type: 'income'})}
                className={`py-2 text-sm font-bold border-2 ${formData.type === 'income' ? 'bg-tui-green border-tui-green text-tui-base' : 'border-tui-overlay text-tui-subtext'}`}>
                INCOME
             </button>
          </div>
          <Input type="date" label="Date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="uppercase" />
          <Input type="number" label="Amount (Rs)" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" required />
          <Input type="text" label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Category" required />
          <Input type="text" label="Note" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <Button type="submit" variant="primary" className="w-full mt-2">COMMIT RECORD</Button>
       </div>
    </form>
  );
};

export const FinanceTableWidget: React.FC = () => {
  const [transactions, setTransactions] = useState<FinanceData[]>([]);
  
  const load = async () => {
    const data = await StorageService.loadFinances();
    setTransactions(data);
  };

  useEffect(() => {
    load();
    window.addEventListener('finance-update', load);
    return () => window.removeEventListener('finance-update', load);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transaction?')) {
      try {
        await StorageService.deleteFinance(id);
        window.dispatchEvent(new Event('finance-update'));
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar">
       <table className="w-full text-left border-collapse">
          <thead className="text-xs text-tui-subtext bg-tui-surface sticky top-0">
             <tr>
                <th className="p-2 border-b-2 border-tui-overlay">TYPE</th>
                <th className="p-2 border-b-2 border-tui-overlay">CAT</th>
                <th className="p-2 border-b-2 border-tui-overlay">DATE</th>
                <th className="p-2 border-b-2 border-tui-overlay text-right">AMT</th>
                <th className="p-2 border-b-2 border-tui-overlay"></th>
             </tr>
          </thead>
          <tbody className="text-sm font-mono">
             {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-tui-surface group border-b border-tui-overlay/50">
                   <td className="p-2">
                      {tx.type === 'income' ? <span className="text-tui-green flex items-center gap-1"><ArrowUpRight size={14}/> IN</span> : <span className="text-tui-red flex items-center gap-1"><ArrowDownLeft size={14}/> OUT</span>}
                   </td>
                   <td className="p-2 text-tui-text font-bold truncate max-w-[100px]">{tx.category}</td>
                   <td className="p-2 text-tui-subtext">{new Date(tx.date).toLocaleDateString()}</td>
                   <td className={`p-2 text-right font-bold ${tx.type === 'income' ? 'text-tui-green' : 'text-tui-text'}`}>
                      {tx.type === 'income' ? '+' : '-'}Rs {tx.amount.toFixed(2)}
                   </td>
                   <td className="p-2">
                      <button onClick={() => handleDelete(tx.id)} className="text-tui-red opacity-0 group-hover:opacity-100 hover:text-tui-text transition-opacity">
                         <Trash size={14} />
                      </button>
                   </td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
};

export const ExpenseBreakdownWidget: React.FC = () => {
   const [data, setData] = useState<{name: string, value: number, color: string}[]>([]);
   
   const load = async () => {
      const finances = await StorageService.loadFinances();
      const expenses = finances.filter(f => f.type === 'expense');
      
      const grouped: Record<string, number> = {};
      expenses.forEach(e => {
         grouped[e.category] = (grouped[e.category] || 0) + e.amount;
      });

      const colors = ['#f38ba8', '#fab387', '#f9e2af', '#a6e3a1', '#89b4fa', '#cba6f7'];
      const result = Object.entries(grouped).map(([name, value], idx) => ({
         name,
         value,
         color: colors[idx % colors.length]
      }));
      setData(result);
   };

   useEffect(() => {
      load();
      window.addEventListener('finance-update', load);
      return () => window.removeEventListener('finance-update', load);
   }, []);

   return (
      <div className="w-full h-full min-h-[150px] relative">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie 
                  data={data} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={40} 
                  outerRadius={60} 
                  stroke="var(--color-base)"
                  strokeWidth={2}
               >
                  {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
               </Pie>
               <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #313244' }}
                  itemStyle={{ color: '#cdd6f4' }}
                  formatter={(value: number) => `Rs ${value.toFixed(2)}`}
               />
               <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }}/>
            </PieChart>
         </ResponsiveContainer>
      </div>
   );
};

export const SavingsGoalWidget: React.FC = () => {
   const [goal] = useState(5000);
   const [current] = useState(1250);
   const percentage = Math.min(100, Math.round((current / goal) * 100));

   return (
      <div className="h-full flex flex-col justify-center">
         <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-tui-subtext uppercase">Emergency Fund</span>
            <span className="text-tui-green font-bold">Rs {current} / Rs {goal}</span>
         </div>
         <div className="h-4 bg-tui-surface border border-tui-overlay relative">
            <div className="h-full bg-tui-green absolute top-0 left-0 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
         </div>
         <div className="flex justify-between items-center mt-2">
             <span className="text-xs text-tui-subtext">{percentage}% REACHED</span>
             <Target size={14} className="text-tui-green" />
         </div>
      </div>
   );
};

export const SubscriptionWidget: React.FC = () => {
   const [subs, setSubs] = useState<Subscription[]>([]);
   const [newSub, setNewSub] = useState({ name: '', cost: '' });

   const load = async () => {
      const data = await StorageService.loadSubscriptions();
      setSubs(data);
   };

   useEffect(() => {
      load();
   }, []);

   const addSub = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newSub.name || !newSub.cost) return;
      
      try {
         await StorageService.addSubscription({
            name: newSub.name,
            cost: parseFloat(newSub.cost)
         });
         await load();
         setNewSub({ name: '', cost: '' });
      } catch (error) {
         console.error('Failed to add subscription:', error);
      }
   };

   const deleteSub = async (id: string) => {
      if (!confirm('Delete this subscription?')) return;
      try {
         await StorageService.deleteSubscription(id);
         await load();
      } catch (error) {
         console.error('Failed to delete subscription:', error);
      }
   };

   const total = subs.reduce((a, b) => a + b.cost, 0);

   return (
      <div className="h-full flex flex-col">
         <div className="flex-1 overflow-auto custom-scrollbar space-y-2 mb-2">
            {subs.map((s) => (
               <div key={s.id} className="flex justify-between items-center p-2 bg-tui-surface border border-tui-overlay group">
                  <div className="flex items-center gap-2 overflow-hidden">
                     <button onClick={() => deleteSub(s.id)} className="text-tui-subtext hover:text-tui-red opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash size={12} />
                     </button>
                     <span className="text-sm text-tui-text truncate">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold text-tui-red">-Rs {s.cost.toFixed(2)}</span>
               </div>
            ))}
            {subs.length === 0 && <div className="text-xs text-tui-subtext italic">No recurring subscriptions.</div>}
         </div>
         
         <form onSubmit={addSub} className="flex gap-2 shrink-0 border-t border-tui-overlay pt-2 mb-2">
             <Input value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} placeholder="Service" className="h-8 text-xs" />
             <Input type="number" value={newSub.cost} onChange={e => setNewSub({...newSub, cost: e.target.value})} placeholder="Rs" className="h-8 text-xs w-20" />
             <Button type="submit" variant="secondary" className="px-2 h-[34px]"><Plus size={14}/></Button>
         </form>

         <div className="pt-2 border-t-2 border-tui-overlay flex justify-between items-center text-xs font-bold shrink-0">
            <span className="text-tui-subtext">TOTAL MONTHLY</span>
            <span className="text-tui-red flex items-center gap-1"><CreditCard size={12}/> Rs {total.toFixed(2)}</span>
         </div>
      </div>
   );
};

// --- JOURNAL WIDGETS ---

export const JournalEditorWidget: React.FC = () => {
  const [mood, setMood] = useState(3);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) {
      alert('Please write something first');
      return;
    }

    setSaving(true);
    try {
      await StorageService.addJournal({
        mood,
        text,
        date: new Date().toISOString()
      });
      window.dispatchEvent(new Event('journal-update'));
      setText('');
      setMood(3);
      alert('Journal entry saved!');
    } catch (error) {
      console.error('Failed to save journal:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
     <div className="h-full flex flex-col gap-4 overflow-hidden">
        <div className="shrink-0">
           <label className="block text-xs font-bold text-tui-blue uppercase tracking-wider mb-2">MOOD (1-5)</label>
           <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                 <button type="button" key={val} onClick={() => setMood(val)} className={`flex-1 py-2 font-bold border-2 transition-transform active:scale-95 ${mood === val ? 'bg-tui-yellow text-tui-base border-tui-yellow' : 'bg-tui-surface text-tui-subtext border-tui-overlay hover:border-tui-yellow'}`}>{val}</button>
              ))}
           </div>
        </div>
        <div className="flex-1 bg-tui-surface border-2 border-tui-overlay p-4 relative min-h-0">
           <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-full bg-transparent text-tui-text focus:outline-none resize-none font-mono text-sm leading-relaxed" placeholder="-- INSERT MODE --" spellCheck={false} />
        </div>
        <div className="shrink-0">
           <Button onClick={handleSave} variant="primary" className="w-full" disabled={saving}>
              <Save size={16} /> {saving ? 'SAVING...' : 'WRITE AND QUIT'}
           </Button>
        </div>
     </div>
  );
};

export const JournalHistoryWidget: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  const load = async () => {
    const data = await StorageService.loadJournal();
    setEntries(data);
  };

  useEffect(() => {
    load();
    window.addEventListener('journal-update', load);
    return () => window.removeEventListener('journal-update', load);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this journal entry?')) {
      try {
        await StorageService.deleteJournal(id);
        window.dispatchEvent(new Event('journal-update'));
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  return (
     <div className="h-full overflow-auto custom-scrollbar space-y-4">
        {entries.map((entry) => (
           <div key={entry.id} className="bg-tui-base border border-tui-overlay p-3 hover:border-tui-mauve transition-colors group">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-tui-mauve">{new Date(entry.date).toLocaleDateString()}</span>
                 <div className="flex items-center gap-2">
                    <span className="text-xs bg-tui-overlay px-2 py-0.5 rounded text-tui-text">MOOD: {entry.mood}</span>
                    <button onClick={() => handleDelete(entry.id)} className="text-tui-red opacity-0 group-hover:opacity-100 hover:text-tui-text transition-opacity">
                       <Trash size={14} />
                    </button>
                 </div>
              </div>
              <p className="text-sm text-tui-subtext line-clamp-4">{entry.text}</p>
           </div>
        ))}
        {entries.length === 0 && <div className="text-center text-tui-subtext py-4">No journal entries yet</div>}
     </div>
  );
};

export const MoodTrendWidget: React.FC = () => {
   const [data, setData] = useState<{date: string, mood: number}[]>([]);

   const load = async () => {
      const journal = await StorageService.loadJournal();
      const sorted = journal.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
      
      const mapped = sorted.map(e => ({
         date: new Date(e.date).toLocaleDateString(undefined, {weekday: 'short'}),
         mood: e.mood
      }));
      setData(mapped);
   };

   useEffect(() => {
      load();
      window.addEventListener('journal-update', load);
      return () => window.removeEventListener('journal-update', load);
   }, []);

   return (
      <div className="w-full h-full min-h-[100px]">
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <XAxis dataKey="date" stroke="#a6adc8" fontSize={10} tickLine={false} axisLine={false} />
               <YAxis domain={[1, 5]} stroke="#a6adc8" fontSize={10} tickLine={false} axisLine={false} tickCount={5} />
               <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #313244' }}
               />
               <Line type="monotone" dataKey="mood" stroke="#cba6f7" strokeWidth={2} dot={{ r: 3, fill: '#cba6f7' }} />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
};

export const GratitudeWidget: React.FC = () => {
   const [items, setItems] = useState<string[]>([]);
   const [newItem, setNewItem] = useState('');

   const load = async () => {
      const data = await StorageService.loadGratitude();
      setItems(data);
   };

   useEffect(() => {
      load();
   }, []);

   const add = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newItem.trim()) return;
      const updated = [newItem, ...items];
      setItems(updated);
      await StorageService.saveGratitude(updated);
      setNewItem('');
   };

   const remove = async (index: number) => {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      await StorageService.saveGratitude(updated);
   };

   return (
      <div className="h-full flex flex-col">
         <form onSubmit={add} className="flex gap-2 mb-2">
            <Input placeholder="I am grateful for..." value={newItem} onChange={e => setNewItem(e.target.value)} />
            <Button type="submit" variant="secondary" className="px-2"><Plus size={16}/></Button>
         </form>
         <div className="flex-1 overflow-auto custom-scrollbar space-y-2">
            {items.map((it, i) => (
               <div key={i} className="flex justify-between items-center p-2 bg-tui-surface border border-tui-overlay group">
                  <div className="flex items-center gap-2">
                      <Heart size={12} className="text-tui-red" />
                      <span className="text-xs text-tui-text">{it}</span>
                  </div>
                  <button onClick={() => remove(i)} className="text-tui-subtext hover:text-tui-red opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash size={12} />
                  </button>
               </div>
            ))}
            {items.length === 0 && <div className="text-tui-subtext text-xs italic text-center p-2">Gratitude helps rewire the brain.</div>}
         </div>
      </div>
   );
};

// --- HABITS WIDGETS ---

export const HabitFormWidget: React.FC = () => {
   const [newHabitName, setNewHabitName] = useState('');
   const [adding, setAdding] = useState(false);

   const addHabit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newHabitName.trim()) return;

      setAdding(true);
      try {
         await StorageService.addHabit({
            name: newHabitName,
            frequency: 'daily',
            streak: 0,
            longestStreak: 0,
            lastCompletedDate: null,
            history: []
         });
         window.dispatchEvent(new Event('habit-update'));
         setNewHabitName('');
      } catch (error) {
         console.error('Failed to add habit:', error);
         alert('Failed to add habit. Please try again.');
      } finally {
         setAdding(false);
      }
   };

   return (
      <form onSubmit={addHabit} className="flex gap-2">
         <Input placeholder="New habit (e.g., Morning Run)..." value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} disabled={adding} />
         <Button type="submit" variant="primary" className="px-4" disabled={adding}>
            {adding ? 'ADDING...' : <><Plus size={16} /> ADD</>}
         </Button>
      </form>
   );
};

export const HabitListWidget: React.FC = () => {
   const [habits, setHabits] = useState<Habit[]>([]);
   
   const load = async () => {
      const data = await StorageService.loadHabits();
      setHabits(data);
   };

   useEffect(() => {
      load();
      window.addEventListener('habit-update', load);
      return () => window.removeEventListener('habit-update', load);
   }, []);

   const toggleHabit = async (id: string) => {
      try {
         await StorageService.toggleHabit(id);
         window.dispatchEvent(new Event('habit-update'));
      } catch (error) {
         console.error('Failed to toggle habit:', error);
      }
   };

   const deleteHabit = async (id: string) => {
      if (!confirm('Delete this habit?')) return;
      try {
         await StorageService.deleteHabit(id);
         window.dispatchEvent(new Event('habit-update'));
      } catch (error) {
         console.error('Failed to delete habit:', error);
      }
   };

   const isCompletedToday = (habit: Habit) => {
      if (!habit.lastCompletedDate) return false;
      const today = new Date().toDateString();
      const lastCompleted = new Date(habit.lastCompletedDate).toDateString();
      return today === lastCompleted;
   };

   return (
      <div className="h-full overflow-auto custom-scrollbar space-y-2">
         {habits.map((h) => (
            <div key={h.id} className="bg-tui-surface border border-tui-overlay p-3 hover:border-tui-green transition-colors group">
               <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-tui-text">{h.name}</span>
                  <button onClick={() => deleteHabit(h.id)} className="text-tui-red opacity-0 group-hover:opacity-100 hover:text-tui-text transition-opacity">
                     <Trash size={14} />
                  </button>
               </div>
               <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-tui-subtext">
                     <span className="text-tui-yellow">🔥 {h.streak}d</span> • Best: {h.longestStreak}d
                  </div>
               </div>
               <button onClick={() => toggleHabit(h.id)} disabled={isCompletedToday(h)} className={`w-full py-2 font-bold border-2 transition-all ${isCompletedToday(h) ? 'bg-tui-green border-tui-green text-tui-base cursor-not-allowed opacity-70' : 'bg-tui-base border-tui-green text-tui-green hover:bg-tui-green hover:text-tui-base'}`}>
                  {isCompletedToday(h) ? '✓ COMPLETED TODAY' : 'MARK COMPLETE'}
               </button>
            </div>
         ))}
         {habits.length === 0 && <div className="text-center text-tui-subtext py-8">No habits yet. Add one to get started!</div>}
      </div>
   );
};

export const HeatmapWidget: React.FC = () => {
   const weeks = 10;
   const days = 7;
   
   return (
      <div className="h-full flex flex-col justify-center overflow-hidden">
         <div className="flex items-center gap-2 mb-2">
            <Grid size={16} className="text-tui-subtext"/>
            <span className="text-xs font-bold text-tui-subtext">CONSISTENCY MATRIX</span>
         </div>
         <div className="flex gap-1 overflow-x-auto custom-scrollbar">
            {Array.from({length: weeks}).map((_, w) => (
               <div key={w} className="flex flex-col gap-1">
                  {Array.from({length: days}).map((_, d) => {
                     const active = Math.random() > 0.6;
                     return (
                        <div 
                           key={d} 
                           className={`w-3 h-3 rounded-sm ${active ? 'bg-tui-green' : 'bg-tui-surface border border-tui-overlay'}`}
                           title={`Day ${d + 1}`}
                        ></div>
                     );
                  })}
               </div>
            ))}
         </div>
      </div>
   );
};

// --- INSIGHTS WIDGET ---

export const AiInsightsWidget: React.FC = () => {
   const [loading, setLoading] = useState(false);
   const [report, setReport] = useState('');

   const generateReport = async () => {
      setLoading(true);
      setReport('');
      
      try {
         const result = await GeminiService.generateLifeInsights();
         setReport(result);
      } catch (error) {
         console.error('Failed to generate insights:', error);
         setReport('Failed to generate insights. Please try again later.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="h-full flex flex-col">
         <Button onClick={generateReport} variant="primary" className="mb-4 w-full" disabled={loading}>
            <Brain size={16} /> {loading ? 'GENERATING INSIGHTS...' : 'RUN COGNITIVE ANALYSIS'}
         </Button>
         
         {report && (
            <div className="flex-1 overflow-auto custom-scrollbar bg-tui-surface border border-tui-overlay p-4">
               <pre className="whitespace-pre-wrap font-mono text-sm text-tui-text leading-relaxed">{report}</pre>
            </div>
         )}
         
         {!report && !loading && (
            <div className="flex-1 flex items-center justify-center text-tui-subtext text-sm italic">
               Click above to generate AI-powered insights from your data
            </div>
         )}
      </div>
   );
};

// --- SETTINGS WIDGET ---

export const SettingsWidget: React.FC<{ user: UserProfile | null, onThemeChange: (t: string) => void }> = ({ user, onThemeChange }) => {
   const [currentTheme, setCurrentTheme] = useState(StorageService.getTheme());
   const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
   const [passMsg, setPassMsg] = useState('');

   const themes = [
     { id: 'dracula', name: 'Dracula', bg: '#1e1e2e', accent: '#cba6f7' },
     { id: 'aura', name: 'Aura', bg: '#15141b', accent: '#a277ff' },
     { id: 'memento', name: 'Memento', bg: '#000000', accent: '#ffffff' },
     { id: 'tokyo', name: 'Tokyo', bg: '#24283b', accent: '#7aa2f7' },
   ];
 
   const handleThemeSelect = async (themeId: string) => {
     setCurrentTheme(themeId);
     await StorageService.setTheme(themeId);
     if (onThemeChange) onThemeChange(themeId);
   };

   const handleExportData = async () => {
      try {
         const data = await ApiService.exportUserData();
         const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `nemesis-data-${new Date().toISOString().split('T')[0]}.json`;
         a.click();
         URL.revokeObjectURL(url);
         alert('Data exported successfully!');
      } catch (error) {
         console.error('Failed to export data:', error);
         alert('Failed to export data. Please try again.');
      }
   };

   const handleLogout = () => {
      if (confirm('Are you sure you want to logout?')) {
         StorageService.logout();
         window.location.reload();
      }
   };

   const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setPassMsg('');
      
      if (passwordForm.new !== passwordForm.confirm) {
         setPassMsg('Error: Passwords do not match.');
         return;
      }
      
      if (passwordForm.new.length < 4) {
         setPassMsg('Error: Password must be at least 4 characters.');
         return;
      }

      try {
         await ApiService.changePassword(passwordForm.old, passwordForm.new);
         setPassMsg('Success: Password updated.');
         setPasswordForm({ old: '', new: '', confirm: '' });
      } catch (error: any) {
         setPassMsg(`Error: ${error.message}`);
      }
   };
 
   return (
     <div className="space-y-6 pb-8 h-full overflow-auto custom-scrollbar">
       <div className="space-y-4 font-mono text-sm bg-tui-surface p-4 border border-tui-overlay">
            <div className="grid grid-cols-3 gap-4 border-b border-tui-overlay pb-2 opacity-50">
               <span className="text-tui-subtext">PARAMETER</span>
               <span className="col-span-2 text-tui-mauve font-bold">VALUE</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
               <span className="text-tui-text">UID</span>
               <span className="col-span-2 text-tui-blue bg-tui-surface p-1 border border-tui-overlay">{user?.id}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
               <span className="text-tui-text">USER</span>
               <span className="col-span-2 text-tui-green bg-tui-surface p-1 border border-tui-overlay">"{user?.name}"</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
               <span className="text-tui-text">MAIL</span>
               <span className="col-span-2 text-tui-yellow bg-tui-surface p-1 border border-tui-overlay">"{user?.email}"</span>
            </div>
       </div>

       <div className="space-y-4">
          <div className="flex items-center gap-2 text-tui-subtext mb-2">
             <Palette size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Interface Theme</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {themes.map((theme) => (
                <button 
                   key={theme.id} 
                   onClick={() => handleThemeSelect(theme.id)} 
                   className={`p-4 border-2 flex flex-col items-center justify-center gap-3 transition-all ${currentTheme === theme.id ? 'border-tui-mauve bg-tui-surface' : 'border-tui-overlay hover:border-tui-subtext hover:bg-tui-surface'}`}
                >
                   <span className={`font-bold text-sm ${currentTheme === theme.id ? 'text-tui-mauve' : 'text-tui-text'}`}>
                      {theme.name.toUpperCase()}
                   </span>
                </button>
             ))}
          </div>
       </div>

       <div className="space-y-4 border border-tui-overlay p-4 bg-tui-surface">
         <div className="flex items-center gap-2 text-tui-subtext mb-2">
            <Lock size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Access Control</span>
         </div>
         <form onSubmit={handleChangePassword} className="space-y-2">
            <Input 
               type="password" 
               placeholder="Current Password" 
               value={passwordForm.old} 
               onChange={e => setPasswordForm({...passwordForm, old: e.target.value})} 
            />
            <div className="grid grid-cols-2 gap-2">
               <Input 
                  type="password" 
                  placeholder="New Password" 
                  value={passwordForm.new} 
                  onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} 
               />
               <Input 
                  type="password" 
                  placeholder="Confirm New" 
                  value={passwordForm.confirm} 
                  onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} 
               />
            </div>
            <div className="flex justify-between items-center">
               <span className={`text-xs ${passMsg.includes('Error') ? 'text-tui-red' : 'text-tui-green'}`}>
                  {passMsg}
               </span>
               <Button type="submit" variant="primary">UPDATE KEY</Button>
            </div>
         </form>
       </div>

       <div className="space-y-4 border border-tui-overlay p-4 bg-tui-surface">
         <div className="flex items-center gap-2 text-tui-subtext mb-2">
            <Shield size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Data Management</span>
         </div>
         <div className="space-y-2">
            <Button onClick={handleExportData} variant="secondary" className="w-full">
               📥 EXPORT ALL DATA
            </Button>
            <Button onClick={handleLogout} variant="danger" className="w-full">
               🚪 LOGOUT
            </Button>
         </div>
       </div>
     </div>
   );
};