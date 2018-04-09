import { h, app } from 'hyperapp';
import List from './components/List';
import locals from '../styles/App.sass';

const state = {
    containers: [{ name: 'Yes we do' }, { name: 'wa' }],
};

const actions = {};

const view = ({ containers }, actions) => (
    <div class={ locals.app }>
        <h1>Margaret 1.0</h1>
        <List datasource={ containers } />
    </div>
);

export default app(state, actions, view, document.body);

if (module.hot) {
  module.hot.accept('./App.js', () => {
    debugger;
    app(state, actions, view, document.body)
  });
}
