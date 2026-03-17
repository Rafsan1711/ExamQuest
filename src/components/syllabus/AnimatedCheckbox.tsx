import { clsx } from 'clsx';
import React, { useState, useEffect } from 'react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accentColor: string;
  label?: string;
}

export const AnimatedCheckbox = React.memo(({ checked, onChange, accentColor, label }: AnimatedCheckboxProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (checked) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [checked]);

  // Convert hex to rgba for the 20% opacity background
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const bgColor = checked ? hexToRgba(accentColor, 0.2) : 'transparent';
  const borderColor = checked ? accentColor : 'rgba(255, 255, 255, 0.2)';

  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={clsx(
            'w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200 ease-out',
            isAnimating ? 'scale-110' : 'scale-100'
          )}
          style={{
            backgroundColor: bgColor,
            borderColor: borderColor,
          }}
        >
          <svg
            className={clsx(
              'w-3.5 h-3.5 text-white transition-transform duration-200 ease-out',
              checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      {label && <span className="text-sm text-blue-200/70 group-hover:text-white transition-colors">{label}</span>}
    </label>
  );
});
