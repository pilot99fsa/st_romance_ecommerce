// Hooksもしくは公式ライブラリからのインポート
import bcryptjs from 'bcryptjs';

//ローカルからのインポート
import db from '@/common/db';
import User from '@/models/User';


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||  //メールアドレスなので『@』が含まれてないとエラーが出るようにする
    !password ||
    password.trim().length < 5 //パスワードは最低でも6文字以上入力させるように、5文字以下だとエラーを出す。trim()は入力された文字の両端から空白を取り除く。
  ) {
    res.status(422).json({
      message: '認証エラーです',
    });
    return;
  }

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: '既に会員登録されています!' }); //一つのメールアドレスで複数のアカウント保持を防ぐための処理
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password), //入力されたパスワードをハッシュ化する。
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: '会員登録が完了しました!',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export default handler;

//以下はメモ 兼 忘備録
//bcryptjsはJavaScriptに最適化されたbcryptのパッケージ
//パスワードのハッシュ化とはデータを不可逆変換して置き換えること。
//例えばpasswordと入力されたらそれを$2b$10$7f9myKwdo9BDUOkybKpQoOSMeEX90aRRFfOdj.c3dG6RIjZxZ/a4mみたいにグチャグチャな文字列に変換する