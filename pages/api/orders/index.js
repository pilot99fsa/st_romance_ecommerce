import db from '@/common/db';
import Order from '@/models/Order';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send('signin required');
  }

  await db.connect();
  const newOrder = new Order({
    ...req.body,
    user: user._id,
  });

  const order = await newOrder.save();
  res.status(201).send(order);
};
export default handler;

//"getSeeeion"はセキュリティの観点から現在は非推奨
//代わりに"getToken"が望ましい