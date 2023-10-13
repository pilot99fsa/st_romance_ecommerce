/* eslint-disable @next/next/no-img-element */
//上記のESlintエラーの無効化はVScode上でimgタグ内に直接画像ファイルを挿入しないために設定

// Hooksもしくは公式ライブラリからのインポート
import Link from 'next/link';
import React from 'react';

const ProductItem = ({ product }) => {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`} legacyBehavior>
        <a>
          {/* ここではTailwind CSSでレスポンシブ対応させるため、少し描画速度が遅くなるがnextコンポーネントのnext/imageではなく、通常のhtmlのimgタグを使う */}
          <img
            src={product.image}
            alt={product.name}
            className="rounded shadow"
          />
        </a>
      </Link>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`} legacyBehavior>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        {/* 商品のブランド名 */}
        <p>{product.brand}</p>
        {/* 価格 */}
        <p>
          {product.price.toLocaleString('ja-JP', {
            currency: 'JPY',
          })}
          &nbsp;円
        </p>
      </div>
    </div>
  );
};

export default ProductItem;

//以下はメモ
//2023/07/31現在 Linkタグ内にaタグを含める場合はタグ内にlegacyBehaviorを追加しなければエラーが発生する
