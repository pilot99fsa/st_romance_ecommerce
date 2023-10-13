import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import React from 'react';

const Unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title={"ユーザー認証が確認できませんでした。"}>
      <h1 className="text-xl">ユーザー認証が確認できませんでした。もう一度ログインし直して下さい。</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
};

export default Unauthorized;
