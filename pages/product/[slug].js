// Hooksもしくは公式ライブラリからのインポート
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
//useRouterは、Next.jsが用意しているhooksの一つで、routeに関する様々な情報を持つrouterオブジェクトへのアクセスを提供する。

//ローカルからのインポート
import Layout from '@/components/Layout';
// import data from '@/common/data';
import { Store } from '@/common/Store';
import Product from '@/models/Product';
import db from '@/common/db';
import { toast } from 'react-toastify';

//ここから個々の商品ページを構築する記述を行う
const ProductScreen = (props) => {
  const { product } = props;

  const { state, dispatch } = useContext(Store);
  //個別の商品ページでカートに追加するボタンをクリックしたら自動でカートの中身のページに遷移する
  const router = useRouter();
  // const { query } = useRouter();
  //data.jsに記述したslugをqueryに指定する(URLがproducts/それぞれの商品のslug)
  // const { slug } = query;
  //findは配列内の要素を探して一番最初に見つかった要素を取得する。
  // const product = data.products.find((x) => x.slug === slug);
  //商品が見つからなかった場合
  if (!product) {
    //商品がなかったことを示す画面を表示する
    return (
      <Layout title="商品が見つかりませんでした">
        商品が見つかりませんでした。
      </Layout>
    );
  }
  //カートに追加するボタンをクリックしたらカートに商品を追加する
  const addTCartHandler = async () => {
    //商品が存在した場合はカートの数字を増やす
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
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
    router.push('/cart');
  };
  //商品が見つかった場合
  return (
    // 商品の名前を取得して表示する
    <Layout title={product.name}>
      {/* py-4は上下のpaddingをそれぞれ8pxに設定する */}
      <div className="py-2">
        <Link href="/">戻る</Link>
      </div>
      {/* 画面幅が769px以上で商品の写真と商品情報が隣に並ぶ。それ以下だと縦に並ぶ */}
      <div className="grid md:grid-cols-3 md:gap-3">
        {/* 親要素にて画面幅769px以上で横一列に４つの要素が並ぶように指定している。
         col-span-2はそのうちの2つ分の要素を使う */}
        <div className="md:col-span-2 md:mb-5">
          {/* 画像の情報取得とスタイリング 始まり */}
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
          {/* 画像の情報取得とスタイリング 終わり */}
        </div>
        {/* 商品説明 始まり */}
        <div className="md: col-span-1 items-center">
          <div className="mt-5">
            <ul className="text-sm sm:text-base">
              <li>
                <h1 className="py-2 text-xl md:text-3xl">{product.name}</h1>
              </li>
              <li>カテゴリー: {product.category}</li>
             
              <li>商品の説明: {product.description}</li>
            </ul>
          </div>
          {/* 商品説明 終わり */}

          {/* "商品の価格"と"在庫状況"と"カートに入れるボタン"のカード 始まり */}
          <div className="flex justify-center">
            <div className="card w-9/12 md:w-full p-5 my-2 sm:my-5 md:my-10">
              {/* 価格 始まり*/}
              <div className="mb-2 flex justify-between">
                <div>価格</div>
                <div>
                  {product.price.toLocaleString('ja-JP', {
                    currency: 'JPY',
                  })}{' '}
                  &nbsp;円
                </div>
              </div>
              {/* 価格 終わり */}

              {/* 在庫状況 始まり */}
              <div className="mb-2 flex justify-between">
                <div>在庫状況</div>
                {/* 在庫状況に関する記述。0以上であれば在庫あり。0であれば在庫なし */}
                <div>
                  {product.countInStock > 0 ? (
                    '在庫あり'
                  ) : (
                    <p className="text-red-500">在庫なし</p>
                  )}
                </div>
              </div>
              {/* 在庫情報 終わり */}

              {/* カートに追加するボタン 始まり */}
              <button
                className="primary-button w-full text-sm md:text-xl"
                onClick={addTCartHandler}
              >
                カートに追加する
              </button>
              {/* カートに追加するボタン 終わり */}
            </div>
          </div>
        </div>
        {/* "商品の価格"と"在庫状況"と"カートに入れるボタン"のカード 終わり */}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
};

export default ProductScreen;

//以下はメモ
//2023/07/31 Linkタグ内にaタグを含める場合はタグ内にlegacyBehaviorを追加しなければエラーが発生する

//以下はcol-span-n(nは任意の数字)に関してのメモ
//<div className="grid grid-cols-3 parent"> 親要素で3カラムのグリッドであることを指定
//<div className="col-span-1 child">1</div1>
//<div className="col-span-2 child">2</div1> この要素で2カラム分使っている
//<div className="col-span-1 child">3</div1> 上の二つの要素で３つ分のカラムを使っているため、ここから下の段に改行される
//<div className="col-span-1 child">4</div1>
//</div> 閉じタグ
