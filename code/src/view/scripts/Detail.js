import { h } from 'hyperapp'

import Tags from './Tags'
import Stars from './Stars'

import locals from '../styles/Detail.sass'

export default ({ name = '未命名文件', stars, tags, actress, comment }) => (
  <div class={ locals.detail }>
    <div class={ locals.name }>{ name }</div>
    <div class={ locals.stars }>
      <Stars stars={ stars }/>
    </div>
    <div class={ locals.tags }>
      <Tags tags={ tags }></Tags>
    </div>
    <div class={ locals.form }>
      <div class={ locals.actress }>
        <label for="">主演</label>
        <input type="text" />
      </div>
      <div class={ locals.comment }>
        <label for="">评价</label>
        <textarea rows="6"></textarea>
      </div>
      <div>
        <button>保存</button>
      </div>
    </div>
  </div>
)
