import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-50 text-amber-900 px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-300"
    >
      <WifiOff className="w-4 h-4 text-amber-600 animate-pulse" />
      <span>Modo Sin Conexión — Datos clínicos cacheados en dispositivo</span>
    </div>
  );
};
