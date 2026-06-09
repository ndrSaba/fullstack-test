import { useState, useEffect } from 'react';
import { Modal, Form, Radio, Input, Space, Tag, Row, Col, InputNumber, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

const TransactionModal = ({ visible, onCancel, onSubmit, editingTransaction, loading }) => {
  const [form] = Form.useForm();
  const [currentType, setCurrentType] = useState('expense');

  // Categories suggestions for easy entry
  const expenseCategories = ['Food', 'Rent', 'Utilities', 'Transport', 'Leisure', 'Health', 'Shopping', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];

  useEffect(() => {
    if (visible) {
      if (editingTransaction) {
        setCurrentType(editingTransaction.type);
        form.setFieldsValue({
          type: editingTransaction.type,
          category: editingTransaction.category,
          amount: editingTransaction.amount,
          date: dayjs(editingTransaction.date),
          description: editingTransaction.description
        });
      } else {
        setCurrentType('expense');
        form.resetFields();
        form.setFieldsValue({
          type: 'expense',
          date: dayjs(),
          amount: 10
        });
      }
    }
  }, [visible, editingTransaction, form]);

  const selectSuggestedCategory = cat => {
    form.setFieldsValue({ category: cat });
  };

  const handleFinish = values => {
    onSubmit(values);
  };

  return (
    <Modal
      title={
        <div className="mb-2 border-b pb-3 text-lg font-bold">
          {editingTransaction ? 'Edit Diary Entry' : 'Add New Entry'}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-2">
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
          <span className="secondary mr-2 text-xs">Suggested:</span>
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
            <Form.Item name="amount" label="Amount (€)" rules={[{ required: true, message: 'Please enter an amount' }]}>
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
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingTransaction ? 'Save Changes' : 'Add Entry'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionModal;
