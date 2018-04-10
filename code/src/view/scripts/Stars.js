import { h } from 'hyperapp'

import ICON from './ICON'

import locals from '../styles/Stars.sass'

const loveLevel = ['较差', '差', '一般', '漂亮', '非常棒']

export default ({ stars = 0, max = 5 }) => (
  <div class={ locals.stars }>
    { Array(stars).fill(0).map(() => <ICON iconName="starOn" />) }
    { Array(max - stars).fill(0).map(() => <ICON iconName="starOff" />) }
    <span class={ locals.desc }>{ loveLevel[stars] || '未评分' }</span>
  </div>
)
