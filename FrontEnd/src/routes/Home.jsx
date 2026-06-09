import { useState, useEffect, useCallback } from 'react';
import { Button, message, Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ContentPanel from '../components/core/layout/ContentPanel';
import Api from '../helpers/core/Api';
import StatsSummary from '../components/diary/StatsSummary';
import FilterCard from '../components/diary/FilterCard';
import TransactionTable from '../components/diary/TransactionTable';
import TransactionModal from '../components/diary/TransactionModal';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Search & Filter state
  const [filterType, setFilterType] = useState('all');
  const [searchCategory, setSearchCategory] = useState('');

  // API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (searchCategory) params.category = searchCategory;

      const res = await Api.get('/transactions', { params });
      setTransactions(res.data || []);
    } catch (err) {
      message.error('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  }, [filterType, searchCategory]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculate statistics
  const stats = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
      } else {
        acc.expense += t.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = stats.income - stats.expense;

  const handleCreateOpen = () => {
    setEditingTransaction(null);
    setModalVisible(true);
  };

  const handleEditOpen = transaction => {
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  const handleFormSubmit = async values => {
    try {
      const payload = {
        ...values,
        date: values.date.toISOString()
      };

      if (editingTransaction) {
        await Api.patch(`/transactions/${editingTransaction._id}`, payload);
        message.success('Transaction updated successfully');
      } else {
        await Api.post('/transactions', payload);
        message.success('Transaction added successfully');
      }

      setModalVisible(false);
      fetchTransactions();
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async id => {
    try {
      await Api.delete(`/transactions/${id}`);
      message.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (err) {
      message.error('Failed to delete transaction');
    }
  };

  const handleResetFilters = () => {
    setFilterType('all');
    setSearchCategory('');
  };

  return (
    <ContentPanel
      title="Expense & Income Diary"
      loading={loading && transactions.length === 0}
      titleAction={
        <Button
          type="primary"
          icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />}
          size="large"
          onClick={handleCreateOpen}
          className="shadow-sm"
        >
          Add Entry
        </Button>
      }
    >
      <div className="p-4 lg:p-6">
        {/* KPI Statistics Section */}
        <StatsSummary stats={stats} balance={balance} />

        {/* Filters and Controls */}
        <FilterCard
          filterType={filterType}
          setFilterType={setFilterType}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
        />

        {/* Table of Entries */}
        <Card className="rounded-lg shadow-sm" bodyStyle={{ padding: '0px' }}>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            onEdit={handleEditOpen}
            onDelete={handleDelete}
            onResetFilters={handleResetFilters}
          />
        </Card>

        {/* Create / Edit Modal */}
        <TransactionModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleFormSubmit}
          editingTransaction={editingTransaction}
          loading={loading}
        />
      </div>
    </ContentPanel>
  );
};

export default Home;
