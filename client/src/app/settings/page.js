"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { IoClose as CloseIcon } from "react-icons/io5";


export default function SettingsPage() {
  const [easyMode, setEasyMode] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();


  useEffect(() => {    
    const savedEasyMode = JSON.parse(localStorage.getItem('easyMode'));
    if (savedEasyMode) {
      setEasyMode(savedEasyMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('easyMode', JSON.stringify(easyMode));
  }, [easyMode]);


  const handleDarkModeChange = (e) => {
    setTheme(theme === "light" ? "dark" : "light")
  };

  const handleEasyModeChange = () => {
    setEasyMode(!easyMode);
    // Handle easy mode toggle logic here, e.g., update context or local storage
  };

  return (
    <div className="p-4">
      <div className='flex flex-row justify-between mb-6'>
        <h1 className="text-2xl">Settings</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-red-500 px-1 rounded"
        >
          <CloseIcon className='w-6 h-6 text-white'/>
        </button>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={handleDarkModeChange}
            className="mr-2 ml-2"
          />
          Dark Mode
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={easyMode}
            onChange={handleEasyModeChange}
            className="mr-2 ml-2"
          />
          Easy Mode
        </label>
      </div>
      
    </div>
  );
}
