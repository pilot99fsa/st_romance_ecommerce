
import { getError } from '@/common/error';
import Layout from '@/components/Layout';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SECCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
  }
};

const OrderScreen = () => {

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order, succesPay, loadingPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || succesPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (succesPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'JPY',
          },
        });

        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, succesPay]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDeliverd,
    deliverdAt,
  } = order;



  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: totalPrice },
        },
      ],
    }).then((orderID) => {
      return orderID;
    });
  }
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (datails) => {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          datails
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('支払いが正常に完了しました！');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  const onError = (err) => {
    toast.error(getError(err));
  }


  return (
    <Layout title={`注文番号 ${orderId}`}>
      <h1 className="mb-4 text-xl">{`注文番号 : ${orderId}`}</h1>
      {loading ? (
        <div>ローディング中...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid lg:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto lg:col-span-3">
            <div className="card p-2 sm:p-5">
              <h2 className="mb-2 text-lg">配送先の情報</h2>
              <div className="w-full text-left">
                <ul>
                  <li className="p-1 text-left bg-slate-100">
                    {shippingAddress.kanjiFullName}
                  </li>
                  <li className="p-1 text-left">
                    {shippingAddress.furiganaFullName}
                  </li>
                  <li className="p-1 text-left bg-slate-100">
                    〒{shippingAddress.postalCode}
                  </li>
                  <li className="p-1 text-left">
                    {' '}
                    {shippingAddress.prefectures}
                  </li>
                  <li className="p-1 text-left bg-slate-100">
                    {' '}
                    {shippingAddress.city}
                  </li>
                  <li className="p-1 text-left">
                    {' '}
                    {shippingAddress.strNumAndSptNum}
                  </li>
                </ul>
              </div>
              {isDeliverd ? (
                <div className="alert-success">{deliverdAt}に配送しました</div>
              ) : (
                <div className="alert-error">配達前です。</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">支払い方法</h2>
              <div className="p-1 bg-slate-100">{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">{paidAt}に支払い済みです</div>
              ) : (
                <div className="alert-error">支払い前です。</div>
              )}
            </div>

            <div className="card overfrow-x-auto p-2 sm:p-5">
              <h2 className="mb-2 text-lg">注文した商品</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr className="text-xs sm:text-base md:text-lg whitespace-nowrap">
                    <th className="px-5 text-left">商品</th>
                    <th className="p-1 md:p-5 text-center bg-slate-100 rounded-t-sm">
                      数量
                    </th>
                    <th className="p-1 md:p-5 text-center">金額</th>
                    <th className="p-1 md:p-5 center bg-slate-100 rounded-t-sm">
                      合計金額
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b text-xs sm:text-base md:text-lg"
                    >
                      <td>
                        <Link href={`/product/${item.slug}`} legacyBehavior>
                          <a className="flex items-center pr-1 py-1">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              style={{
                                maxWidth: '100%',
                                height: 'auto',
                              }}
                            ></Image>
                            &nbsp;
                            <p className="w-auto truncate">{item.name}</p>
                          </a>
                        </Link>
                      </td>
                      <td className="pl-1 py-1 md:p-5 text-center bg-slate-100">
                        {item.quantity}
                      </td>
                      <td className="pl-1 py-1 text-center">
                        {item.price.toLocaleString('ja-JP', {
                          currency: 'JPY',
                        })}
                        &nbsp;円
                      </td>
                      <td className="pl-1 py-1 md:p-5 text-center bg-slate-100">
                        {(item.quantity * item.price).toLocaleString('ja-JP', {
                          currency: 'JPY',
                        })}
                        &nbsp;円
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card p-2 sm:p-5">
              <h2 className="mb-2 text-lg">注文の詳細</h2>
              <ul>
                <li>
                  <div className="mb-2 p-1 flex justify-between bg-slate-100">
                    <div>商品</div>
                    <div>
                      {itemsPrice.toLocaleString('ja-JP', {
                        currency: 'JPY',
                      })}
                      円
                    </div>
                  </div>
                </li>
                {''}
                <li>
                  <div className="mb-2 p-1 flex justify-between">
                    <div>消費税</div>
                    <div>
                      {taxPrice.toLocaleString('ja-JP', {
                        currency: 'JPY',
                      })}
                      &nbsp;円
                    </div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 p-1 flex justify-between bg-slate-100">
                    <div>送料</div>
                    <div>
                      {shippingPrice.toLocaleString('ja-JP', {
                        currency: 'JPY',
                      })}
                      &nbsp;円
                    </div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 p-1 flex justify-between">
                    <div>お支払い金額</div>
                    <div className="font-bold">
                      {totalPrice.toLocaleString('ja-JP', {
                        currency: 'JPY',
                      })}
                      &nbsp;円
                    </div>
                  </div>
                </li>
                {paymentMethod === '現金払い(代引き)' ? <li className="notice-payment">代引きのため、荷物のお受け取りの際にお支払い下さい。</li> : <li>
                  {!isPaid && (
                    <div>
                      {isPending ? (<div>ローディング...</div>) :
                        (<div className='w-full'>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            className='w-[400]'></PayPalButtons>
                        </div>
                        )}
                      {loadingPay && <div>ローディング...</div>}
                    </div>
                  )}</li>}

              </ul>
            </div>
          </div>
        </div>
      )
      }
    </Layout >
  );
};

OrderScreen.auth = true;
export default OrderScreen;
