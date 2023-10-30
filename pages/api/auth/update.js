// Hooksもしくは公式ライブラリからのインポート
import { getToken } from 'next-auth/jwt';
import bcryptjs from 'bcryptjs';

//ローカルからのインポート
import db from '@/common/db';
import User from '@/models/User';

//プロフィール情報を変更する機能についての記述
const hadler = async (req, res) => {
  if (req.method !== 'PUT') { // 'PUT'はリソースの更新および追加を行うHTTPメソッドである
    return res
      .status(400)
      .send({ message: `${req.method}はサポートされていません。` });
  }

  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send({ message: 'サインインして下さい' }); //ユーザー情報が存在してなければ、ログインを促す画面に飛ばされる。そもそもログインしなければプロフィールを更新できない
  }

  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') || //メールアドレスには『＠』が含まれる必要がある
    (password && password.trim().length < 5) //パスワードは最低でも5文字以上設定する必要がある(5文字ではダメ、6文字は必要)
  ) {
    res.status(422).json({
      message: '認証エラーです。',
    });
    return;
  }
　　　　
  await db.connect();　
  const toUpdateHandler = await User.findById(user._id);
  toUpdateHandler.name = name;　
  toUpdateHandler.email = email;
  if (password) {
    toUpdateHandler.password = bcryptjs.hashSync(password); //パスワードはしっかりハッシュ化する
  }
  await toUpdateHandler.save();
  await db.disconnect();
  res.send({
    message: 'プロフィール情報を更新しました。', //更新に成功したことを知らせる
  });
};
export default hadler;

//getSessionは公式から非推奨になっている
