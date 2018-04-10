import { h } from 'hyperapp'

import Tags from './Tags'
import Stars from './Stars'

import locals from '../styles/Detail.sass'

export default ({ stars, tags, actress, comment }) => (
  <div class={ locals.detail }>
    <div class={ locals.stars }>
      <Stars stars={ stars }/>
    </div>
    <div class={ locals.tags }>
      <Tags tags={ tags }></Tags>
    </div>
    <div class={ locals.form }>
      <div class={ locals.actress }>
        <label for=""></label>
        <input type="text" />
      </div>
      <div class={ locals.comment }>
      </div>
      <div>
        <button></button>
      </div>
    </div>
  </div>
)
