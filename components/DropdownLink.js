import Link from 'next/link';
import React from 'react';

//画面右上のユーザー名をクリックするとアコーディオンのようにリンクが展開するUIコンポーネント
const DropdownLink = (props) => {
  let { href, children, ...rest } = props;

  return (
    <Link href={href} legacyBehavior>
      <a {...rest}> {children}</a>
    </Link>
  );
};
export default DropdownLink;

