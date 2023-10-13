// Hooksもしくは公式ライブラリからのインポート
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

//ローカルからのインポート
import { getError } from '@/common/error';
import Layout from '@/components/Layout';


const ProfileScreen = () => {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('name', session.user.name); //名前の初期値
    setValue('email', session.user.email); //メールアドレスの初期機 
  }, [session.user, setValue]); //両方とも現在のセッションから取得する

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', { //ログインに必要な情報も更新される()
        redirect: false,
        email,
        password,
      });

      toast.success('プロフィールを更新しました。');

      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="プロフィール">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">プロフィールの更新</h1>
        <div className="mb-4">
          <label htmlFor="name">名前</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', {
              required: '名前を入力して下さい。',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register('email', {
              required: 'メールアドレスを入力して下さい。',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: '有効なメールアドレスを入力して下さい',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            className="w-full"
            id="password"
            {...register('password', {
              required: 'メールアドレスを入力して下さい。',
              minLength: {
                value: 6,
                message: 'パスワードは5文字以上入力して下さい。',
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">
            パスワードを再度入力して下さい。
          </label>
          <input
            type="password"
            className="w-full"
            id="confirmPassword"
            {...register('cconfirmPassword', {
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'パスワードは5文字以上入力して下さい。',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">パスワードが一致しません。</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">
            プロフィール情報を更新する。
          </button>
        </div>
      </form>
    </Layout>
  );
};

ProfileScreen.auth = true;

export default ProfileScreen;
