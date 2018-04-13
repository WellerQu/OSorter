import { h } from 'hyperapp'

import ICON from './ICON'

import locals from '../styles/Stars.sass'

const loveLevel = ['未评分', '较差', '差', '一般', '漂亮', '非常棒']

export default ({ stars = 0, max = 5, ratingHandler }) => (
  <div class={locals.stars}>
    {Array(max)
      .fill(0)
      .map((_, i) => (
        <span onmouseover={() => ratingHandler(i + 1)}>
          {i < stars && <ICON iconName="starOn" />}
          {i >= stars && <ICON iconName="starOff" />}
        </span>
      ))}
    <span class={locals.desc}>{loveLevel[stars]}</span>
  </div>
)
