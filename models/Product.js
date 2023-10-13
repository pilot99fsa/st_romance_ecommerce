import mongoose from 'mongoose';

// Userスキーマを定義
// スキーマとは？・・・データを格納する構造の定義
const productSchema = new mongoose.Schema(
  //スキーマ関数はオブジェクトを受け取り、任意のプロパティを指定してスキーマを定義する
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: false },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
  //timeStamp: true は作成された日付と更新された日付を記録する
);
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
//以下はメモ
//requiredはtureで入力必須項目に設定にする
//uniqueu Mongooseで重複した値が登録できなくする値
//つまり今回はメールアドレスの重複登録を防止するために設定する
