// Hooksもしくは公式ライブラリからのインポート
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-toastify';
//React Hook Form は React 用のフォームバリデーションライブラリです。
//input 要素に入力した値を取得するだけではなくバリデーション機能なども備えており
//簡単にフォームを実装することができます。(reffect.co.jp/react/react-hook-form/#google_vignetteより引用)
//入力内容のバリデーション(検証)はreact-hook-formがシンプルで手軽である

//ローカルからのインポート
import Layout from '@/components/Layout';
import { getError } from '@/common/error';
import { useRouter } from 'next/router';
import axios from 'axios';

const LoginScreen = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }, //初期状態をエラーにしておく
  } = useForm();
  //react-hook-form メソッドについて
  //register :input要素またはform要素を登録し、React-Hook-Formに検証ルールを適用できます。
  //handleSubmit :この関数は、フォームの検証が成功した場合にフォームデータを受け取ります。
  //formState:form内の入力の有無や送信の状態などを取得できる

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        //トーストを表示させる(通知みたいなやつ)
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  // signIn()メソッドを使用すると、サインインフローを完了した後にユーザが最初に戻ったページに確実に戻ることができます。
  // また、Eメールでサインインする場合は、CSRFトークンを自動的に処理します。
  return (
    //ログインフォーム
    <Layout title="新規会員登録">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">新規会員登録</h1>
        <div class="mb-4">
          <label htmlFor="name">名前</label>
          <input
            type="text"
            className="w-full"
            id="name"
            placeholder='適当な名前を入力してください。'
            autoFocus
            {...register('name', {
              required: '名前を入力して下さい',
            })}
          />
          {/* エラーが出た時に表示するメッセージ"メールアドレスを入力してください" */}
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        {/** Eメールフォーム 始まり */}
        <div class="mb-4">
          <label htmlFor="email">Eメール</label>
          <input
            type="email"
            placeholder='適当で架空のアドレスを入力してください。例）xxx@xx.com'
            {...register('email', {
              required: 'メールアドレスを入力して下さい',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i, //メールアドレスの正規表現以外が入力されたらNGにする
                message: '有効なメールアドレスを入力してください',
              },
            })}
            className="w-full"
            id="email"
          ></input>
          {/* エラーが出た時に表示するメッセージ"メールアドレスを入力してください" */}
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        {/** Eメールフォーム 終わり */}

        {/** パスワードフォーム 始まり */}
        <div class="mb-4">
          <label htmlFor="パスワード">パスワード</label>
          <input
            type="password"
            {...register('password', {
              required: 'パスワードを入力して下さい',
              minLength: { value: 6, message: '少なくとも5文字以上は必要です' },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="パスワードを認証">パスワードを登録する</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'パスワードを登録して下さい。',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 2,
                message: 'パスワードは6文字以上入力して下さい。',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">
                正しいパスワードを入力して下さい
              </div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">登録</button>
        </div>

        <div className="mb-4">
          アカウントをお持ちでないですか？ &nbsp;
          <Link href={`/register?redirect=${redirect || `/`}`}>
            新規会員登録
          </Link>
        </div>
      </form>
    </Layout>
    //ログインフォーム 終わり
  );
};

export default LoginScreen;

//以下はメモ
// try...catch文について
//try{
// 処理をかく、エラーが起こってしまったら処理を中断し、catchに飛ぶ
// } catch(e) { エラーが起きてしまったら発火する処理、エラーが発生しましたページ見せて、エラー文を社内メールに送る処理を書くとか }
// catch文は、予想していない異常によりエラーが発生するような場面で意図的に回避するための処理である。
// finally文配下のコードは最後に必ず実行される。
