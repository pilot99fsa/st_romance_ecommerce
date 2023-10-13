// Hooksもしくは公式ライブラリからのインポート
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

//ローカルからのインポート
import Layout from '@/components/Layout';
import CheckoutWizard from '@/components/CheckoutWizard';
import { Store } from '@/common/Store';
import { useRouter } from 'next/router';

const ShippingScreen = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  //useFormを使うと簡単に入力フォームが作成できる

  const { state, dispatch } = useContext(Store);
  //復習 useContext()は、contextの値を参照できる。
  //()の中身はcreateContextで記述されたjsファイル名が入る。今回はStore
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();
  useEffect(() => {
    setValue('kanjiFullName', shippingAddress.kanjiFullName);
    setValue('furiganaFullName', shippingAddress.furiganaFullName);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('prefectures', shippingAddress.prefectures);
    setValue('city', shippingAddress.city);
    setValue('strNumAndSptNum', shippingAddress.strNumAndSptNum);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    kanjiFullName,
    furiganaFullName,
    postalCode,
    prefectures,
    city,
    strNumAndSptNum,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        kanjiFullName,
        furiganaFullName,
        postalCode,
        prefectures,
        city,
        strNumAndSptNum,
      },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          kanjiFullName,
          furiganaFullName,
          postalCode,
          prefectures,
          city,
          strNumAndSptNum,
        },
      })
    );

    router.push('/payment');
  };

  return (
    <Layout title="配送情報の入力">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">配送先情報の入力</h1>
        <div className="mb-4">
          <label htmlFor="KanjiFullName">名前</label>
          <input
            className="w-full"
            id="kanjiFullName"
            autoFocus
            {...register('kanjiFullName', {
              required: '名前を入力して下さい(漢字)',
            })}
          />
          {errors.kanjiFullName && (
            <div className="text-red-500">{errors.kanjiFullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="furiganaFullName">ふりがな</label>
          <input

            className="w-full"
            id="furiganaFullName"
            {...register('furiganaFullName', {
              required: 'ふりがなを入力して下さい。',
            })}
          />
          {errors.address && (
            <div className="text-red-500">
              {errors.furiganaFullName.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">郵便番号</label>
          <input
            className="w-full"
            id="postalCode"
            {...register('postalCode', {
              required: '郵便番号を入力して下さい',
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500 ">{errors.postalCode.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="prefectures">都道府県</label>
          <input
            className="w-full"
            id="prefectures"
            {...register('prefectures', {
              required: '都道府県を入力して下さい。',
            })}
          />
          {errors.prefectures && (
            <div className="text-red-500 ">{errors.prefectures.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">市区町村</label>
          <input
            className="w-full"
            id="city"
            {...register('city', {
              required: '市区町村を入力して下さい。',
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="strNumAndSptNum">番地および部屋番号</label>
          <input

            className="w-full"
            id="strNumAndSptNum"
            {...register('strNumAndSptNum', {
              required: '番地および部屋番号を入力して下さい。',
            })}
          />
          {errors.strNumAndSptNum && (
            <div className="text-red-500 ">
              {errors.strNumAndSptNum.message}
            </div>
          )}
        </div>

        <div className="mb-4 flex justify-center">
          <button
            className="primary-button w-9/12 md:w-3/8"
            type='submit'
          >次へ</button>
        </div>

      </form>
    </Layout>
  );
};

ShippingScreen.auth = true;

export default ShippingScreen;

//以下はメモ

//<form>で囲った<button>をクリックすると自動でsubmitされるのはbuttonタグのtypeの初期値がsubmitで設定されているため
//だからタグ内にリンク先を設定する必要はなく、ボタンを押してsubmitされた際に関数処理を予め記述し、
//<form>タグ内にonSumbit={handleSubmit(任意の関数名、このコードではsubmitHandler)}を記述して、<button>を
//クリックすれば記述した処理が走る(このコードの場合は35行目から70行目のsubmitHandlerのこと)
//なお、formタグで囲ったbuttonのtypeの初期値がsubmitなのはReactに限った話ではない