import { Row, Col, Card, Space, Radio, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const FilterCard = ({ filterType, setFilterType, searchCategory, setSearchCategory }) => (
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
);

export default FilterCard;
