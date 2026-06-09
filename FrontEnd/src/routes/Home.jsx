import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Radio,
  DatePicker,
  Space,
  Popconfirm,
  Card,
  Col,
  Row,
  Statistic,
  message,
  Tag,
  Typography,
  Tooltip
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faEdit,
  faArrowUp,
  faArrowDown,
  faWallet,
  faUndo,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import ContentPanel from '../components/core/layout/ContentPanel';
import Api from '../helpers/core/Api';

const { Text, Paragraph } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Search & Filter state
  const [filterType, setFilterType] = useState('all');
  const [searchCategory, setSearchCategory] = useState('');

  const [form] = Form.useForm();

  // Categories suggestions for easy entry
  const expenseCategories = ['Food', 'Rent', 'Utilities', 'Transport', 'Leisure', 'Health', 'Shopping', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];

  const [currentType, setCurrentType] = useState('expense');

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all transactions for statistics.
      // We filter on the frontend for category search and type for a reactive, fast UI,
      // or we can request them from the API. Let's fetch the list from API.
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

  // Calculate statistics (always based on the current filtered list of transactions)
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

  // Open modal for Create
  const handleCreateOpen = () => {
    setEditingTransaction(null);
    setCurrentType('expense');
    form.resetFields();
    form.setFieldsValue({
      type: 'expense',
      date: dayjs(),
      amount: 10
    });
    setModalVisible(true);
  };

  // Open modal for Edit
  const handleEditOpen = transaction => {
    setEditingTransaction(transaction);
    setCurrentType(transaction.type);
    form.setFieldsValue({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: dayjs(transaction.date),
      description: transaction.description
    });
    setModalVisible(true);
  };

  // Handle Form Submit
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

  // Handle Delete
  const handleDelete = async id => {
    try {
      await Api.delete(`/transactions/${id}`);
      message.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (err) {
      message.error('Failed to delete transaction');
    }
  };

  // Set default category on tag click
  const selectSuggestedCategory = cat => {
    form.setFieldsValue({ category: cat });
  };

  // Table Columns
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: type => (
        <Tag color={type === 'income' ? 'success' : 'error'} className="font-semibold capitalize">
          <FontAwesomeIcon icon={type === 'income' ? faArrowUp : faArrowDown} className="mr-1" />
          {type}
        </Tag>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      fontWeight: 'bold',
      render: text => <Text strong>{text}</Text>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (val, record) => (
        <Text strong type={record.type === 'income' ? 'success' : 'danger'} style={{ fontSize: '15px' }}>
          {record.type === 'income' ? '+' : '-'}€{val.toFixed(2)}
        </Text>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => dayjs(date).format('LL')
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: text => <Text type="secondary">{text || '-'}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={faEdit} className="text-info" />}
              onClick={() => handleEditOpen(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this entry?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<FontAwesomeIcon icon={faTrash} />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

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
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card
              bordered={false}
              className="rounded-lg shadow-sm transition-shadow hover:shadow-md"
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={<span className="text-secondary font-medium">Total Income</span>}
                value={stats.income}
                precision={2}
                valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                prefix={<FontAwesomeIcon icon={faArrowUp} className="text-success mr-2" />}
                suffix="€"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              bordered={false}
              className="rounded-lg shadow-sm transition-shadow hover:shadow-md"
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={<span className="text-secondary font-medium">Total Expenses</span>}
                value={stats.expense}
                precision={2}
                valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
                prefix={<FontAwesomeIcon icon={faArrowDown} className="text-danger mr-2" />}
                suffix="€"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              bordered={false}
              className="rounded-lg shadow-sm transition-shadow hover:shadow-md"
              bodyStyle={{ padding: '20px', borderLeft: `4px solid ${balance >= 0 ? '#52c41a' : '#ff4d4f'}` }}
            >
              <Statistic
                title={<span className="text-secondary font-medium">Net Balance</span>}
                value={balance}
                precision={2}
                valueStyle={{ color: balance >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}
                prefix={<FontAwesomeIcon icon={faWallet} className="mr-2" />}
                suffix="€"
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Controls */}
        <Card className="mb-6 rounded-lg shadow-sm" bodyStyle={{ padding: '16px' }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={12}>
              <Space size="large" wrap>
                <span className="text-secondary font-semibold">Filter Type:</span>
                <Radio.Group
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="income" className="text-success">
                    Incomes
                  </Radio.Button>
                  <Radio.Button value="expense" className="text-danger">
                    Expenses
                  </Radio.Button>
                </Radio.Group>
              </Space>
            </Col>
            <Col xs={24} md={12} className="text-right">
              <Input
                placeholder="Search category..."
                prefix={<FontAwesomeIcon icon={faSearch} className="text-secondary mr-2" />}
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                allowClear
                className="w-full max-w-[300px]"
              />
            </Col>
          </Row>
        </Card>

        {/* Table of Entries */}
        <Card className="rounded-lg shadow-sm" bodyStyle={{ padding: '0px' }}>
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="_id"
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50']
            }}
            locale={{
              emptyText: (
                <div className="py-8">
                  <Paragraph className="text-secondary mb-2">No entries found matching filters.</Paragraph>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setFilterType('all');
                      setSearchCategory('');
                    }}
                  >
                    <FontAwesomeIcon icon={faUndo} className="mr-2" /> Reset Filters
                  </Button>
                </div>
              )
            }}
          />
        </Card>

        {/* Create / Edit Modal */}
        <Modal
          title={
            <div className="mb-2 border-b pb-3 text-lg font-bold">
              {editingTransaction ? 'Edit Diary Entry' : 'Add New Entry'}
            </div>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{
              type: 'expense',
              date: dayjs(),
              amount: 10
            }}
            className="pt-2"
          >
            <Form.Item name="type" label="Transaction Type" rules={[{ required: true }]}>
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                className="w-full text-center"
                onChange={e => setCurrentType(e.target.value)}
              >
                <Radio.Button value="expense" className="w-1/2">
                  Expense
                </Radio.Button>
                <Radio.Button value="income" className="w-1/2">
                  Income
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please enter or select a category' }]}
            >
              <Input placeholder="Enter category (e.g. Food, Salary, Rent)" />
            </Form.Item>

            {/* Quick Category Tags */}
            <div className="mb-4">
              <span className="text-secondary mr-2 text-xs">Suggested:</span>
              <Space wrap size={4}>
                {(currentType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                  <Tag
                    key={cat}
                    className="cursor-pointer transition-colors hover:bg-gray-100"
                    onClick={() => selectSuggestedCategory(cat)}
                  >
                    {cat}
                  </Tag>
                ))}
              </Space>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="Amount (€)"
                  rules={[{ required: true, message: 'Please enter an amount' }]}
                >
                  <InputNumber min={0.01} precision={2} className="w-full" placeholder="0.00" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select a date' }]}>
                  <DatePicker className="w-full" format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description (Optional)">
              <Input.TextArea placeholder="Enter additional details..." rows={3} />
            </Form.Item>

            <Form.Item className="mb-0 border-t pt-4 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingTransaction ? 'Save Changes' : 'Add Entry'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ContentPanel>
  );
};

export default Home;
