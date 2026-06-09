import { Table, Button, Space, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowUp, faArrowDown, faUndo } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

const TransactionTable = ({ transactions, loading, onEdit, onDelete, onResetFilters }) => {
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
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this entry?"
              onConfirm={() => onDelete(record._id)}
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
            <Button type="dashed" onClick={onResetFilters}>
              <FontAwesomeIcon icon={faUndo} className="mr-2" /> Reset Filters
            </Button>
          </div>
        )
      }}
    />
  );
};

export default TransactionTable;
