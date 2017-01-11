import React from 'react';
import style from './style.css';

export const Home = () => (
  <div>
    <div className={`${style.loader} ${style.loader1}`}></div>
    <span className={style.textBlue}>
      Loading app
    </span>
  </div>
);

export default Home;
