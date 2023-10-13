import mongoose from 'mongoose';
//mongoDBに登録する注文情報の項目

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [ //注文した商品の情報(商品の名前、数量、画像、価格)
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: { //以下は配送先情報
      kanjiFullName: { type: String, required: true },
      furiganaFullName: { type: String, required: true },
      postalCode: { type: String, required: true },
      prefectures: { type: String, required: true },
      city: { type: String, required: true },
      strNumAndSptNum: { type: String, required: true },
    }, //以下は支払いに係る情報
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true, //時刻を記録する設定
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

//以下はメモ 兼 忘備録
///required: trueで入力必須情報に設定する