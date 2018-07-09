import React from 'react';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';
// import { selectTool } from '../../redux/reducer/tools/actions';

function ToolMenu (props) {
  const { selectTool } = props;

  return (
    <div id="tool-menu">
      <ul className="menu">
        <li className="tool" onClick={() => selectTool('move')}><i className="icon-move"></i></li>
        <li className="tool" onClick={() => selectTool('eyedropper')}><i className="icon-eyedropper"></i></li>
        <li className="tool" onClick={() => selectTool('paintBrush')}><i className="icon-paint-brush"></i></li>
        <li className="tool" onClick={() => selectTool('eraser')}><i className="icon-eraser"></i></li>
        <li className="tool" onClick={() => selectTool('paintBucket')}><i className="icon-paint-bucket"></i></li>
        <li className="tool" onClick={() => selectTool('pen')}><i className="icon-pen"></i></li>
        <li className="tool" onClick={() => selectTool('shape')}><i className="icon-shape-circle"></i></li>
        <li className="tool" onClick={() => selectTool('magnify')}><i className="icon-magnify"></i></li>
        <li className="tool" onClick={() => selectTool('hand')}><i className="icon-hand"></i></li>
        <li className="color">
          <div className="two" onClick={() => selectTool('eyedropper')}></div>
          <div className="one" onClick={() => selectTool('eyedropper')}></div>
        </li>
      </ul>
    </div>
  );
}

ToolMenu.propTypes = {
  selectTool: PropTypes.func.isRequired
}

export default ToolMenu;