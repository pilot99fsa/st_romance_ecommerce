import db from '@/common/db';
import Order from '@/models/Order';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send({ message: 'サインインが必要です' });
  }
  await db.connect();
  const orders = await Order.find({ user: user._id });
  await db.disconnect();
  res.send(orders);
};

export default handler;
