import React from 'react';

//商品をカートに入れてチェックアウトするに当たって住所入力、支払い方法、注文内容の確認、それぞれの画面にて必要な情報を入力する際にユーザーに進み具合を分かりやすくするUIのコンポーネント
const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <div className="mb-5  m-auto flex flex-wrap text-sm md:text-base">
      {['ログイン', '配送先の情報', 'お支払い方法', '注文内容の確認'].map(
        (step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2 ${index <= activeStep
              ? 'border-indigo-500   text-indigo-500 h-auto mx-1'
              : 'border-gray-400 text-gray-400 auto mx-1'
              }`}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
};
export default CheckoutWizard;
