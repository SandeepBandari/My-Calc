import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DBHistory.css';

interface HistoryEntry {
  s_no: number;
  value1: number;
  value2: number;
  operationtype: string;
  result: number;
}

const DBHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8080/calc/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.clear();
            navigate('/login');
            return;
          }
          if (response.status === 403) {
            throw new Error("Access denied. Admin privileges required.");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Function to convert operation type to symbol
  const getOperationSymbol = (type: string) => {
    switch(type) {
      case 'add': return '+';
      case 'sub': return '-';
      case 'mul': return '×';
      case 'div': return '÷';
      case 'modulus': return '%';
      default: return type;
    }
  };

  return (
    <div className="db-history-container">
      <h2>Calculation History</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>S no</th>
                <th>Expression</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.s_no}>
                  <td>{entry.s_no}</td>
                  <td>
                    {entry.value1} {getOperationSymbol(entry.operationtype)} {entry.value2}
                  </td>
                  <td>{entry.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DBHistory;