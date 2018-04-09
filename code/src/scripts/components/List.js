import { h } from 'hyperapp';

export default ({ datasource = [] }) => (
    <ul>{datasource.map(n => <li>{n.name}</li>)}</ul>
);
