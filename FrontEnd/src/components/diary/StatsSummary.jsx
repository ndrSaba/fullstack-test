import { Row, Col, Card, Statistic } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faWallet } from '@fortawesome/free-solid-svg-icons';

const StatsSummary = ({ stats, balance }) => (
  <Row gutter={[16, 16]} className="mb-8">
    <Col xs={24} sm={8}>
      <Card
        bordered={false}
        className="rounded-lg shadow-sm transition-shadow hover:shadow-md"
        styles={{
          body: {
            padding: '20px'
          }
        }}
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
        styles={{
          body: {
            padding: '20px'
          }
        }}
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
        styles={{
          body: {
            padding: '20px',
            borderLeft: `4px solid ${balance >= 0 ? '#52c41a' : '#ff4d4f'}`
          }
        }}
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
);

export default StatsSummary;
