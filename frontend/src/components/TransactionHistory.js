import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaCoins, FaSpinner, FaBook, FaExchangeAlt, FaGift, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const TransactionHistory = () => {
  const { getTransactions } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transaction history. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [getTransactions]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'course_redemption':
        return <FaBook className="text-blue-500" />;
      case 'rating_conversion':
        return <FaExchangeAlt className="text-yellow-500" />;
      case 'admin_grant':
        return <FaGift className="text-purple-500" />;
      case 'job_completion':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaCoins className="text-gray-500" />;
    }
  };

  const getTransactionText = (transaction) => {
    switch (transaction.type) {
      case 'course_redemption':
        return `Enrolled in course: ${transaction.course?.title || 'Unknown course'}`;
      case 'rating_conversion':
        return transaction.description;
      case 'admin_grant':
        return transaction.description;
      case 'job_completion':
        return transaction.description;
      default:
        return transaction.description;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-primary text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary text-white p-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="mr-4">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">{getTransactionText(transaction)}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className={`text-lg font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} <FaCoins className="inline text-sm" />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Balance: {transaction.balance} <FaCoins className="inline text-xs text-secondary" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 