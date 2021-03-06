import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Opacity extends Component {
  constructor (props) {
    super(props);
    this.state = {
      input: this.props.tool.opacity,
      isHidden: true
    }
  }

  toggleDropdown = (e) => {
    this.setState(prev => ({ isHidden: !prev.isHidden }));
  }

  hideDropdown = () => {
    this.setState({ isHidden: true });
  }

  handleTextChange = (e) => {
    const value = e.target.value;
    let isValid = /^([0-9%]){1,}$/.test(value);
    isValid = isValid || !value.length;
    
    if (isValid) this.setState({ input: value });
  }

  handleRangeChange = (e) => {
    const { updateOpacity } = this.props;
    const value = `${e.target.value}%`;
    this.setState({ input: value });
    updateOpacity(value);
  }

  confirmInput = () => {
    const { tool, updateOpacity } = this.props;
    this.setState(prev => {
      let input = prev.input;
      let isValid = /^([0-9]){1,}([%]){0,1}$/;           // Valid characters
      isValid = isValid.test(input);
      isValid = isValid && (parseInt(input, 10) <= 100); // Less than or equal to 100%
      const n = isValid && input.indexOf('%');           // First '%' char
      isValid = isValid && n !== 0;                      // '%' is not the first char

      if (isValid) {
        
        // Every character before the first '%' are kept.
        input = input.substring(0, n !== -1 ? n+1 : input.length);
        input = `${parseInt(input, 10)}%`;

      } else {
        input = tool.opacity;
      }

      updateOpacity(input);
      return { input };
    })
  }

  render () {
    const { input, isHidden } = this.state;
    const { tool } = this.props;

    const classNames = {
      button: isHidden ? 'dropdown-btn' : 'dropdown-btn-pressed'
    }

    return (
      <li className="opacity">
        Opacity:
        <div className="text-input">

          <input type="text" value={input} 
            onChange={ this.handleTextChange } 
            onFocus={ this.hideDropdown } 
            onKeyPress={(e) => e.charCode === 13 && this.confirmInput()}
            onBlur={ this.confirmInput }/>

          <button name="button" className={classNames.button} 
            onClick={ this.toggleDropdown }><i className="icon-angle-down"></i>
          </button >
          
        </div>
        { !isHidden &&
        <div className="dropdown-container">

          <div className="range-container">
            <input name="range" type="range" min="0" max="100" value={parseInt(tool.opacity, 10)} 
              onChange={ this.handleRangeChange }
              onBlur={ this.hideDropdown }/>
          </div>
          
        </div> }
      </li>
    );
  }
}

Opacity.propTypes = {
  tool: PropTypes.object.isRequired,
  updateOpacity: PropTypes.func.isRequired
}

export default Opacity;