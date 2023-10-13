import db from '@/common/db';
import Order from '@/models/Order';
import { getToken } from 'next-auth/jwt';

// /api/orders/:id
const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send('サインインが必要です');
  }

  await db.connect();

  const order = await Order.findById(req.query.id); //findByIdは指定のモデルの_idに合致するドキュメントを１つのみ返す。
  await db.disconnect();
  res.send(order); //findByIdで合致した注文情報を返してくる
};

export default handler;
