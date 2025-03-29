'use client'
import { useEffect, useState } from 'react';
import DefenseNotification from '@/components/pages/home/DefenseNotification';
import HomePage from '@/components/pages/home/HomePage';

const Show = () => {
  const [showDefenseNoti, setShowDefenseNoti] = useState(false);
  
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await fetch('/deadline/getAll');
        const data = await response.json();

        interface Deadline {
          deadline_key: string;
          deadline_date: string;
        }

        const thesisDefense = (data as Deadline[]).find(item => item.deadline_key === 'thesis_defense');
        
        if (thesisDefense) {
          const deadlineDate = new Date(thesisDefense.deadline_date);
          const currentDate = new Date();

          setShowDefenseNoti(currentDate > deadlineDate);
        }
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      }
    };
    
    fetchDeadlines();
  }, []);

  return showDefenseNoti ? <DefenseNotification /> : <HomePage />;
};

export default Show;