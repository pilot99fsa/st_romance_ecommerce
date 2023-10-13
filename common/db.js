// Hooksもしくは公式ライブラリ、外部からのインポート
import mongoose from 'mongoose';


const connection = {};

//接続機能
const connect = async () => {
  if (connection.isConnected) {
    console.log('already connected');
    return; ///すでに接続されている
  }
  if (mongoose.connection.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
};

//切断機能
const disconnect = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      //本番環境であれば
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
};
//各documentのIDを文字列に変換し、objectのIDをその文字列に置き換える
const convertDocToObj = (doc) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
};

const db = { connect, disconnect, convertDocToObj };
export default db;

//以下はメモ
//.isConnectedを使用すると、DOMに接続されているかを判定することが可能。
//Document.readyStat はdocumentの読み込み状態を記述します
