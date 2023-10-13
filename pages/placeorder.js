import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '@/common/Store';
import { getError } from '@/common/error';
import CheckoutWizard from '@/components/CheckoutWizard';
import Layout from '@/components/Layout';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';

import { toast } from 'react-toastify';

const PlaceOrderScreen = () => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); //123.4567 ==> 123.46

  const shippingPrice = itemsPrice > 9000 ? 0 : 560;
  const taxPrice = Math.floor(round2(itemsPrice * 0.1));
  const totalPrice = Math.floor(round2(itemsPrice + shippingPrice + taxPrice));

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);

      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set('cart', JSON.stringify({ ...cart, cartItems: [] }));
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="注文の確認">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">注文の確認</h1>
      {cartItems.length === 0 ? (
        <div>
          カートの中身は空です。<Link href="/">お買い物に戻る</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-2 sm:p-5">
              <h2 className="mb-2 text-lg">配送先の住所</h2>
              <div className="w-full text-left">
                <ul>
                  <li className="flex p-1 text-left bg-slate-100">
                    &nbsp;{shippingAddress.kanjiFullName}
                  </li>
                  <li className="p-1 text-left">
                    &nbsp;{shippingAddress.furiganaFullName}
                  </li>
                  <li className="p-1 text-left bg-slate-100">
                    &nbsp;〒{shippingAddress.postalCode}
                  </li>
                  <li className="p-1 text-left">
                    {' '}
                    &nbsp;{shippingAddress.prefectures}
                  </li>
                  <li className="p-1 text-left bg-slate-100">
                    {' '}
                    &nbsp;{shippingAddress.city}
                  </li>
                  <li className="p-1 text-left">
                    {' '}
                    &nbsp;{shippingAddress.strNumAndSptNum}
                  </li>
                </ul>
              </div>
              <div className="pt-2">
                <Link href="/shipping">修正する</Link>
              </div>
            </div>

            <div className="card p-2 sm:p-5">
              <h2 className="mb-2 text-lg">支払い方法</h2>
              <div className="p-1 bg-slate-100">{paymentMethod}</div>
              <div className="pt-2">
                <Link href="/payment">修正する</Link>
              </div>
            </div>

            <div className="card overfrow-x-auto p-2 sm:p-5">
              <h2 className="mb-2 text-lg">注文する商品</h2>
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
                  {cartItems.map((item) => (
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
              <div className="pt-2">
                <Link href="/cart">修正する</Link>
              </div>
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
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? 'ローディング中...' : '注文の確定'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

PlaceOrderScreen.auth = true;

export default PlaceOrderScreen;
