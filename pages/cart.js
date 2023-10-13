// Hooksもしくは公式ライブラリからのインポート
import React, { useContext } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

//ローカルからのインポート
import { Store } from '@/common/Store';
import Layout from '@/components/Layout';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('申し訳ありません、この商品はそれ以上ありません。');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    toast.success('カートの中身の商品の数を変更しました');
  };
  return (
    <Layout title="お買い物カゴ">
      <h1 className="mb-4 text-base md:text-xl">お買い物カゴ</h1>
      {cartItems.length === 0 ? (
        <div>
          カートの中身は空です。<Link href="/">お買い物に戻る</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr className="text-xs sm:text-base md:text-lg">
                  <th className="px-5 text-left">商品</th>
                  <th className="p-1 md:p-5 text-center bg-slate-100 rounded-t-sm">
                    数量
                  </th>
                  <th className="p-1 md:p-5 text-center">価格</th>
                  <th className="p-1 md:p-5 text-center bg-slate-100 rounded-t-sm">
                    削除
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b text-xs md:text-lg">
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
                          <p className="truncate">{item.name}</p>
                        </a>
                      </Link>
                    </td>
                    <td className="pl-1 py-1 md:p-1 text-center bg-slate-100">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                        className="pl-1 py-1 md:p-1"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="pl-1 py-1 md:p-1 text-center">
                      {item.price.toLocaleString('ja-JP', {
                        currency: 'JPY',
                      })}
                      &nbsp;円
                    </td>
                    <td className="pl-1 py-1 md:p-5 text-center bg-slate-100">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5 hover:red"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            <div className="card w-9/12 md:w-full p-5 my-2 sm:my-5 md:my-10">
              <ul>
                <li>
                  <div className="pb-3 text-sm md:text-md lg:text-lg">
                    小計 ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
                    {cartItems
                      .reduce((a, c) => a + c.quantity * c.price, 0)
                      .toLocaleString('ja-JP', {
                        currency: 'JPY',
                      })}
                    &nbsp;円
                  </div>
                </li>
                <li>
                  <button
                    className="primary-button w-full"
                    onClick={() => router.push('login?redirect=/shipping')}
                  >
                    注文に進む
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

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
// 以下はメモ
// .priceの直後に.toLocaleString('ja-JP', { currency: 'JPY'}); で円表記に変換する。currencyは為替、通貨の意味
// 鍵括弧{}の中にstyle:'currency',を追加すると数字の直前に￥を表示させることができる
