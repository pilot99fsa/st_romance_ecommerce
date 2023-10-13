// Hooksもしくは公式ライブラリからのインポート

//ローカルからのインポート
import { Store } from '@/common/Store';
import db from '@/common/db';
import Layout from '@/components/Layout';
import ProductItem from '@/components/ProductItem';
import SplideImage from '@/components/SplideImage';
import Product from '@/models/Product';
import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { } from 'next/router';

const Home = ({ products }) => {

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addTCartHandler = async (product) => {
    //商品が存在した場合はカートの数字を増やす
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    //在庫数以上にカートに追加されないようにする
    if (data.countInStock < quantity) {
      //商品の在庫数よりも追加されようとしたら、アラートメッセージを表示する
      return toast.error(
        '申し訳ありません、この商品はそれ以上在庫がありません。'
      );
    }


    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('商品をカートに追加しました');
  };



  return (
    <Layout title="【公式】セントロマンス - 通販サイト">

      <div className='w-full h-20 md:h-36 mb-4 md:mb-5 rounded -z-10'><SplideImage /></div>
      {/* gridクラスは商品をグリッド状に表示する */}
      {/* grid-cols-1は横一列に商品を１つ表示するグリッドレイアウトを作成する
      マウスオーバーで表示されるCSSプロパティにfrは分数の意味。
      外枠の大きさに対して自動でグリッドを分割してそのサイズを調整する。*/}
      {/* md:grid-cols-3 画面幅768px以上で横一列に商品を３つ、 
      lg:grid-cols-4 画面幅1024px以上で横一列に商品を４つ表示する*/}

      {/* <div className='flex justify-center w-full text-xs md:text-base p-0 mb-4 md:mb-5'>
        <h3 className="mr-1 bg-gray-200 w-1/8 rounded py-2 px-3">探す</h3>
        <input type="text" placeholder="欲しいファッションを見つけよう!" className='w-2/3 p-0' />


      </div> */}

      <div className="grid grid-cols-1 gap-4  md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addTCartHandler={addTCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout >
  );
};
// サーバサイドで実行する処理(getServerSideProps)を定義する
//getServerSideProps()はコンポーネントをレンダリングする前に実行される。getServerSideProps はリクエスト毎に実行されます。
export const getServerSideProps = async () => {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
};

export default Home;

// 以下はメモ
//
