/**
 * Composant pour afficher les logs.
 * @param {Array} logs - Liste des logs avec un message et un type (info, error, debug).
 */

import React, { useRef } from 'react';

export const LogDisplay = ({ logs }) => {
    const logsEndRef = useRef(null);
  
    // Défile automatiquement jusqu'à la fin des logs à chaque mise à jour.
    React.useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);
  
    return (
      <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg h-48 overflow-y-auto font-mono text-sm">
        {logs.map((log, index) => (
          <div key={index} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : log.type === 'debug' ? 'text-yellow-400' : ''}`}>
            {`[${new Date().toLocaleTimeString()}] ${log.message}`}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    );
  };

  /*
  utilisation 
  
  const [logs, setLogs] = useState([]);
        <LogDisplay logs={logs} />


  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };
  
  addLog(`Processing line: ${line}`, 'debug');

  

  */