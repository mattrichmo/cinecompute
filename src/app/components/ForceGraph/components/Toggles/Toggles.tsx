import React from 'react';

// Define TypeScript interface for Toggle props
interface ToggleProps {
  label: string;
  isChecked: boolean;
  handleToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, isChecked, handleToggle }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="checkbox hidden" checked={isChecked} onChange={handleToggle} />
        <div className={`block border-[1px] ${isChecked ? 'border-white' : 'border-gray-900'} w-10 h-6 rounded-full`}></div>
        <div className={`dot absolute left-1 top-1 ${isChecked ? 'bg-white' : 'bg-gray-800'} w-4 h-4 rounded-full transition transform ${isChecked ? 'translate-x-full' : ''}`}></div>
      </div>
      <p className="ml-3 text-white font-medium">
        {label}
      </p>
    </label>
  );
};

// Define TypeScript interface for Toggles props
interface TogglesProps {
  selectedToggle: string;
  setSelectedToggle: (label: string) => void;
}

const Toggles: React.FC<TogglesProps> = ({ selectedToggle, setSelectedToggle }) => {
  const handleToggle = (label: string) => {
    setSelectedToggle(label);
    console.log('Button clicked');
  };

  return (
    <div>
      <div className="mb-2"><p className="text-xs text-gray-500">Click To See Data</p></div>
      <div className="grid grid-cols-2 gap-4 toggle border border-white rounded p-2 text-xs">
        {['Producers', 'Companies', 'Films', 'Technicians', 'Cast'].map((label) => (
          <Toggle
            key={label}
            label={label}
            isChecked={selectedToggle === label}
            handleToggle={() => handleToggle(label)}
          />
        ))}
      </div>
    </div>
  );
};

export default Toggles;