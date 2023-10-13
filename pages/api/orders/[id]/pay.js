// Hooksもしくは公式ライブラリからのインポート
import db from "@/common/db";

//ローカルからのインポート
import Order from "@/models/Order";
import { getToken } from "next-auth/jwt";

const handler = async (req, res) => {
    const user = await getToken({ req });
    if (!user) {
        return res.status(401).send({ message: 'エラー: サインインが必要です。' });
    }

    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
        if (order.isPaid) {
            return res.status(400).send({ message: 'エラー：支払い済みです' });
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address,
        };

        const paidOrder = await order.save();
        await db.disconnect();
        res.send({ message: '支払いに成功しました！', order: paidOrder });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'エラー: 注文が見つかりません。' });
    }
};

export default handler;