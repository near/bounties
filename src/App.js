import React from 'react';
import axios from 'axios';
import './App.css';

const List = (props) => {
  return (
    <tbody>
      {props.items.map(item =>
        <tr key={item.id}>          
          <td>{item.id}</td>
          <td>        
            <a href={item.url} target="_blank">{item.title}</a>
           </td>
          <td>{item.bounty}</td>
          <td>
            <a href={item.author_url} target="_blank">{item.author}</a>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Footer = () => (
  <div className="footer">
    <p className="text-center">
      Forked: <a href="https://codepen.io/odran037/pen/Ypqddm"
                 target="_blank">https://codepen.io/odran037/pen/Ypqddm</a>
    </p>
  </div>
);

const grabBounty = desc => {
  let bounty = desc.match(/# Bounty\s*([^.]+|\S+)/);
  if (bounty == null) {return}
  return bounty[1];
}

class FilteredList extends React.Component {
  constructor() {
    super();
    this.state = {
      initialItems: [],
      items: []
    }
  }

  filterList(event) {
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(item => {
      return item.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1
    });
    this.setState({items: updatedList});
  }
  
  componentWillMount() {
    var thisState = this;
    axios.get("https://api.github.com/repos/near/bounties/issues")
    .then(response => {
      thisState.setState({
        initialItems: response.data.map(item => {
          return {
            id: item.number,
            title: item.title,
            url: item.html_url,
            bounty: grabBounty(item.body),
            author: item.user.login,
            author_page: item.user.html_url
          }
        })
      }
    )})
    .then(_ => thisState.setState({ items: this.state.initialItems }))
    .catch(error => console.error(error));

  }

  render() {
    return (
      <div className="container">
        <h1>near.works<a href="https://github.com/near/bounties/issues/new?assignees=potatodepaulo&labels=tribe&template=bounty.md&title=">/add_bounty_+ </a></h1>
        <h2></h2>
        <div className="filter-list">
          <div class="form-group">
            <input type="text"
                   placeholder="Search title"
                   className="form-control"
                   onChange={this.filterList.bind(this)}/>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr className="success">
                <th>Issue</th>
                <th>Title</th>
                <th>Bounty</th>
                <th>Author</th>
              </tr>
            </thead>
            <List items={this.state.items}/>
          </table>
          <Footer/>
        </div>
      </div>
    );
  }
}
export default FilteredList;