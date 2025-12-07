'use client';

import { useState, useEffect } from 'react';

interface TestComponentProps {
  initialValue?: number;
}

export function TestComponent({ initialValue = 0 }: TestComponentProps) {
  const [count, setCount] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const handleReset = () => {
    setCount(0);
    setIsActive(false);
  };

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="p-4 border rounded">
      <div className="text-2xl font-bold mb-4">Count: {count}</div>
      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

