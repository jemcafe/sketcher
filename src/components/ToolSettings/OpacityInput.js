import React, { Component } from 'react';

class OpacityInput extends Component {
  constructor () {
    super();
    this.state = { isHidden: true }
  }

  render () {
    return (
      <div className="opacity-input">
        <input defaultValue="100%"/>
        <button onClick={() => this.setState(prev =>({isHidden: !prev.isHidden}))}>
          <i className="icon-angle-down"></i>
        </button>
        { !this.state.isHidden &&
        <div className="container" onMouseLeave={() => this.setState({isHidden: true})}>
          <input type="range" min="0" max="100"/>
        </div> }
      </div>
    );
  }
}

export default OpacityInput;