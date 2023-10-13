import { getError } from '@/common/error';
import Layout from '@/components/Layout';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function OrderHistoryScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="注文履歴 ">
      <h1 className="mb-4 text-xl">注文履歴</h1>
      <h3 className="mb-4 text-xs">※IDは下4桁のみ表示してます。</h3>
      {loading ? (
        <div>ローディング中...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b text-xs sm:text-base md:text-lg">
              <tr className="whitespace-nowrap">
                <th className="p-1 md:px-5 text-left">ID</th>
                <th className="p-1 md:p-5 text-left  bg-slate-100">日付</th>
                <th className="p-1 md:p-5 text-center">小計</th>
                <th className="p-1 md:p-5  text-center  bg-slate-100">
                  お支払い
                </th>
                <th className="p-1 md:p-5  text-center">配達</th>
                <th className=" p-1 md:p-5 text-center  bg-slate-100">詳細</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b text-xs sm:text-base md:text-lg"
                >
                  <td className="p-1 md:p-5 whitespace-nowrap">
                    {order._id.substring(20, 24)}
                  </td>
                  <td className="p-1 md:p-5  bg-slate-100">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-1 md:p-5 whitespace-nowrap text-center">
                    {order.totalPrice.toLocaleString('ja-JP', {
                      currency: 'JPY',
                    })}
                    円
                  </td>
                  <td className="p-1 md:p-5 whitespace-nowrap text-center  bg-slate-100">
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : '未払い'}
                  </td>
                  <td className="p-1 md:p-5 whitespace-nowrap text-center">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : '配達前'}
                  </td>
                  <td className="pl-1 py-1 md:p-5 whitespace-nowrap text-center  bg-slate-100">
                    <Link href={`/order/${order._id}`} passHref legacyBehavior>
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
