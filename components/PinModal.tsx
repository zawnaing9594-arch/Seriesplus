import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface PinModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PinModal: React.FC<PinModalProps> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-[#1a1c21] w-full max-w-xs md:max-w-sm rounded-2xl shadow-2xl border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" />
            Admin Access
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 text-center">Enter Security PIN</label>
            <input
              type="tel"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="••••"
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-indigo-500 outline-none text-center text-2xl tracking-[1em] font-mono transition focus:bg-gray-800/80"
              autoFocus
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center font-bold">Incorrect PIN. Try '1234'</p>}
            <p className="text-gray-600 text-xs mt-2 text-center">Default PIN: 1234</p>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition transform active:scale-95 shadow-lg shadow-indigo-500/25">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinModal;