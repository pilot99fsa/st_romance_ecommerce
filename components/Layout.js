// Hooksもしくは公式ライブラリからのインポート
import Link from 'next/link';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '@/common/Store';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';

//ローカルからのインポート
import DropdownLink from './DropdownLink';

const Layout = ({ title, children }) => {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0); //カートの中身の初期値を0に設定する
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);
  //ログアウトした際にクッキー情報を削除してカートに入った商品を削除する
  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' }); //名前をログイン画面へのリンクに切り替える(再度表示する)
  };
  return (
    <>
      {/* Start the Meta-information メタ情報 始まり */}
      <Head>
        <title>{title ? title + ' - St. Romance' : 'St. Romance'}</title>
        <meta
          name="description"
          content="セントロマンスの公式通販サイト。いますぐあなたのお気に入りのファッションを見つけよう!"
        />
        <meta
          name="keywords"
          content="ECサイト、オンラインショップ、通販、ファッションサイト、インターネット通販"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* End of meta-information メタ情報 終わり */}

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        {/* Start the header section ヘッダーセクション始まり  */}
        <header className='bg-slate-50'>
          <nav className="flex items-center px-4 py-2 justify-between shadow-md">
            <Link href="/" legacyBehavior>
              <a className="p-0 text-md text-black leading-[1em]">
                <span className="font-bold tracking-[.12em]">St.Romance</span>{' '}
                <span>ONLINE&nbsp;STORE</span>
              </a>
            </Link>
            {/** "whitespace-nowrap"は改行(折り返し)を防ぐプロパティ */}
            <div className="whitespace-nowrap">
              <Link href="/cart" legacyBehavior>
                <a className="p-2 text-xs md:text-base text-black">
                  商品カート
                  {/* カート内のアイテムの文字数が0より多い場合は少なくとも一つ以上のアイテムが存在する事を意味する */}
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>

              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-xs md:text-base text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg z-10">
                    <Menu.Items>
                      <DropdownLink className="dropdown-link" href="/profile">
                        プロフィール
                      </DropdownLink>
                    </Menu.Items>
                    <Menu.Items>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        注文履歴
                      </DropdownLink>
                    </Menu.Items>
                    <Menu.Items>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        ログアウト
                      </a>
                    </Menu.Items>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" legacyBehavior>
                  <a className="p-2 text-xs md:text-base">ログイン</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        {/* End of the header section ヘッダーセクション終わり  */}

        {/* Start the main section メインセクション始まり  */}
        <main className="container m-auto mt-4 px-4">{children}</main>
        {/* End of the main section メインセクション終わり  */}

        {/* Start the footer section フッターセクション始まり  */}
        <footer className="flex bg-slate-50 p-8 text-center justify-center items-center shadow-inner">
          <p>
            Copyright &copy; 2023 St. Romance
            <br />
            ※当サイトは架空のショッピングサイトです。{' '}
          </p>
        </footer>
        {/* End of the footer section ヘッダーセクション終わり  */}
      </div>
    </>
  );
};

export default Layout;

//以下はメモ
//Linkタグ内にaタグを含める場合はタグ内にlegacyBehaviorを追加しなければエラーが発生する
