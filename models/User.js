import mongoose from 'mongoose';

// Userスキーマを定義
// スキーマとは？・・・データを格納する構造の定義
const userSchema = new mongoose.Schema(
  //スキーマ関数はオブジェクトを受け取り、任意のプロパティを指定してスキーマを定義する
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }

  //timeStamp: true は作成された日付と更新された日付を記録する
);
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
//以下はメモ
//requiredはtureで入力必須項目に設定にする
//uniqueu Mongooseで重複した値が登録できなくする値
//つまり今回はメールアドレスの重複登録を防止するために設定する
