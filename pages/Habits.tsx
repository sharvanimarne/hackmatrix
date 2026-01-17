import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Habit } from '../types';
import { Card, Button, Input, Badge } from '../components/UIComponents';
import { Plus, Trash, Zap } from 'lucide-react';

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    setHabits(StorageService.getHabits());
  }, []);

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName) return;
    const habit: Habit = {
      id: Date.now().toString(),
      userId: '1',
      name: newHabitName,
      frequency: 'daily',
      streak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      history: []
    };
    const updated = [...habits, habit];
    setHabits(updated);
    StorageService.saveHabits(updated);
    setNewHabitName('');
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      
      const today = new Date().toDateString();
      const lastCompleted = h.lastCompletedDate ? new Date(h.lastCompletedDate).toDateString() : null;
      
      if (lastCompleted === today) { return h; }

      const isConsecutive = lastCompleted === new Date(Date.now() - 86400000).toDateString();
      const newStreak = isConsecutive ? h.streak + 1 : 1;
      
      return {
        ...h,
        streak: newStreak,
        longestStreak: Math.max(h.longestStreak, newStreak),
        lastCompletedDate: new Date().toISOString(),
        history: [...h.history, new Date().toISOString()]
      };
    });
    setHabits(updated);
    StorageService.saveHabits(updated);
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    StorageService.saveHabits(updated);
  };

  return (
    <div className="h-full flex flex-col gap-4">
       <Card title="PROCESS_MANAGER">
          <form onSubmit={addHabit} className="flex gap-2 items-end">
             <div className="flex-1">
               <Input 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter new protocol name..."
                  label="NEW PROCESS"
               />
             </div>
             <Button type="submit" variant="secondary" className="h-[38px]">
                <Plus size={16} /> SPAWN
             </Button>
          </form>
       </Card>

       <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
          {habits.map((habit) => {
             const isDoneToday = habit.lastCompletedDate && new Date(habit.lastCompletedDate).toDateString() === new Date().toDateString();
             
             return (
               <div key={habit.id} className="bg-tui-base border-2 border-tui-overlay p-4 flex flex-col justify-between hover:border-tui-mauve transition-colors">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-lg text-tui-text truncate">{habit.name}</h3>
                     <button onClick={() => deleteHabit(habit.id)} className="text-tui-subtext hover:text-tui-red">
                        <Trash size={16} />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                     <div className="bg-tui-surface p-2 text-center border border-tui-overlay">
                        <div className="text-[10px] text-tui-subtext uppercase">Current</div>
                        <div className="text-xl font-bold text-tui-blue">{habit.streak}</div>
                     </div>
                     <div className="bg-tui-surface p-2 text-center border border-tui-overlay">
                        <div className="text-[10px] text-tui-subtext uppercase">Max</div>
                        <div className="text-xl font-bold text-tui-mauve">{habit.longestStreak}</div>
                     </div>
                  </div>

                  <Button 
                     onClick={() => toggleHabit(habit.id)}
                     disabled={!!isDoneToday}
                     variant={isDoneToday ? 'secondary' : 'primary'}
                     className="w-full"
                  >
                     {isDoneToday ? 'COMPLETED' : 'EXECUTE'}
                  </Button>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default Habits;