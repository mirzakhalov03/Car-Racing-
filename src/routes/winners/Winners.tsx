import { Table, Spin } from 'antd';
import Nav from '../../components/navbar/Nav';
import { useGetWinnersQuery, useGetWinnerByIdQuery } from '../../redux/api/winnersApi'; 
import './winners.scss';
import { useState, useEffect } from 'react';

const Winners = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('id'); 
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC'); 
  const [winnerDetails, setWinnerDetails] = useState<Record<number, any>>({});

  const { data, isLoading, error, refetch } = useGetWinnersQuery({
    _page: currentPage,
    _limit: pageSize,
    _sort: sortField,
    _order: sortOrder,
  });

  const totalRecords = parseInt(data?.totalCount || '0', 10);

  useEffect(() => {
    if (data?.data) {
      data.data.forEach((winner: any) => {
        if (!winnerDetails[winner.id]) {
          fetchWinnerDetails(winner.id);
        }
      });
    }
  }, [data]);

  const fetchWinnerDetails = async (id: number) => {
    const { data: winnerData } = useGetWinnerByIdQuery(id, { skip: false });
    if (winnerData) {
      setWinnerDetails((prevDetails) => ({
        ...prevDetails,
        [id]: winnerData,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="winners">
        <Nav />
        <div className="container">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="winners">
        <Nav />
        <div className="container">
          <p>Error loading winners data.</p>
        </div>
      </div>
    );
  }

  const dataSource = data?.data.map((winner: any) => {
    const details = winnerDetails[winner.id] || {};
    return {
      key: winner.id,
      icon: <span style={{ color: details.color || 'black' }}>🏆</span>, 
      name: details.name || `Car ${winner.id}`, 
      wins: winner.wins,
      best: `${winner.time} seconds`,
    };
  });

  const handleTableChange = (pagination: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    if (sorter.order) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
    }
    refetch();
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Wins',
      dataIndex: 'wins',
      key: 'wins',
      sorter: true,
    },
    {
      title: 'Best Time',
      dataIndex: 'best',
      key: 'best',
      sorter: true,
    },
  ];

  return (
    <div className="winners">
      <Nav />
      <div className="container">
        <div className="winner__wrapper">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
            }}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Winners;
