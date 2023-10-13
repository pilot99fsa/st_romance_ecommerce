/* eslint-disable @next/next/no-img-element */
import { Splide, SplideSlide } from '@splidejs/react-splide';
import React from 'react';
import '@splidejs/react-splide/css';


const SplideImage = () => {
  return (
    <Splide aria-label="future-arrival" options={{
      //Splideの各種アニメーションの設定
      type: 'loop', //ループ再生させる
      autoplay: true, //自動再生させる
      interval: 5000, //5秒で切り替わる
      arrows: false, //左右の矢印を非表示にする
    }}>
      <SplideSlide >
        <img src='/images/banner/banner-3.jpg' className="w-full h-20 md:h-36 object-left-bottom object-cover rounded" alt='banner1'></img>
      </SplideSlide>
      <SplideSlide >
        <img src='/images/banner/banner-2.jpg' className="w-full h-20 md:h-36 object-cover rounded" alt='banner1'></img>
      </SplideSlide>
      <SplideSlide >
        <img src='/images/banner/banner-1.jpg' className="w-full h-20 md:h-36 object-left-top object-cover  rounded" alt='banner1'></img>
      </SplideSlide>

    </Splide>
  );
};

export default SplideImage;

//以下はメモ 兼 濃尾録
//SplideはSlickやSwiperと同じスライダーのライブラリであるが、Slickと違いjQueryに依存せず、Swiperと比べて非常に軽量である