// Hooksもしくは公式ライブラリからのインポート
import NextAuth from 'next-auth/next';
import bcryptjs from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';

//ローカルからのインポート
import User from '@/models/User';
import db from '@/common/db';

export default NextAuth({
  session: {
    strategy: 'jwt',  //jwtとは? ...JSON Web Tokens の略
  },
  callbacks: { //callback関数は、アクションが実行された時に何が起こるかを制御できる関数のこと(公式より)
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id; //user.idが存在すれば、token.idはuser.idとする
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [ //認証プロバイダについての記述
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email, //eメールのデータに基づいてMongoDBのデータベース内のユーザーデータを検索する
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) { // bcryptjs.compareSyncでハッシュ化されたパスワードを比較同期する。要は間違ってないかチェックする
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'r',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password'); //Eメールかパスワードが間違っているというエラーを発する。実際は入力されたメールアドレスを基にパスワードが正しいか否かを判定している
      },
    }),
  ],
});

//以下はメモ 兼 忘備録
//sessionのstrategy型はデフォルトではjwtである
//NextAuth.jsはOAuth認証フローを実装するためのライブラリ。
// 参考URL https://qiita.com/Hirohana/items/e3b71af64311e26582a6
