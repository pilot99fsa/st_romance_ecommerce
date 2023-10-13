//ローカルからのインポート
// import data from '@/common/data';
// import db from '@/common/db';
// import Product from '@/models/Product';
// import User from '@/models/User';

// const handler = async (req, res) => {
//   await db.connect();
//   await User.deleteMany();
//   await User.insertMany(data.users);
//   await Product.deleteMany();
//   await Product.insertMany(data.products);
//   await db.disconnect();
//   res.send({ message: 'seeded successfully' });
// };
// export default handler;
// 以下はメモ
// deleteMany() と remove() はどちらも、MongoDB からエントリを削除する
// 現在ではremove()は推奨されていない( deleteOne()とdeleteMany()を推奨)
// deleteMany() は、フィルターに一致するすべてのドキュメントを削除する
// insertMany() は複数のドキュメントをコレクションに挿入する
