
import React, { Component } from 'react';

import { RGBtoHex } from '../helpers/colorConversion';
import { getPosition, getPixelColors } from '../helpers/canvas';

import { connect } from 'react-redux';
import { selectColor, updateColor } from '../redux/reducer/color/actions';

import HueGradient from '../components/HueGradient/HueGradient';

class HueGradientCntr extends Component {
  constructor () {
    super();
    this.state = {
      color: {
        rgb: { r: 255, g: 0, b: 0 },
        hex: '#ff0000',
        x: 0,
        y: 0
      },
      gradientHue: {
        r: 255,
        g: 0,
        b: 0,
        hex: '#ff0000'
      },
      mouse: { x: 0, y: 0 },
      dragging: false,
      focus: false,
      inCanvas: false
    }
  }

  initCanvas = (refs) => {
    const { canvas: c, touch: t, wrapper: w } = refs;
    // refs are unmounted then mounted when the window is resize, so they must cheked for undefined
    if ( c && t && w ) {
      t.width = w.clientWidth;
      t.height = w.clientHeight;
      c.width = t.width;
      c.height = t.height;
      this.setCanvas({ canvas: c });
    }
  }

  engage = (canvas, e) => {
    this.setState({ dragging: true, focus: true, inCanvas: true });
    this.getColor({canvas, e, fire: true});
  }

  disengage = (canvas) => {
    this.setState({ dragging: false, focus: false, inCanvas: false });
  }

  getColor = ({canvas, e, fire}) => {
    if ( this.state.dragging || fire ) {
      // The canvas is updated so the circle changes position.
      this.setCanvas({canvas, e});

      // Canvas context
      const context = canvas.getContext('2d');

      // Color location (mouse location)
      const { color: c } = this.state;
      const initialPos = { x: c.x, y: c.y };
      const pos = getPosition(canvas, e, initialPos);
      const x = pos.x, y = pos.y;
      
      // The .getImageData() method returns an array of the pixel rgb colors [r,g,b,a,r,g,b,a,r...]
      const imgData = context.getImageData(x, y, 1, 1).data;  // .getImageData(x, y, width, height)
      
      const rgb = { r: imgData[0], g: imgData[1], b: imgData[2] };
      const hex = RGBtoHex(rgb.r, rgb.g, rgb.b);

      this.setState({ color: { rgb, hex, x, y } });
      // this.updateMousePosition(e);
      this.props.updateColor({rgb, pos});
    }
    this.updateMousePosition(e);
  }

  changeHue = ({canvas, e, value}) => {
    value = e ? +e.target.value : value;         // The string is converted to a number
    value = (255 * 6) - value;                   // The value starts at max
    let rgb = [0, 0, 0];
    const range = new Array(rgb.length * 2 + 1); // red, green, and blue increases to 255 and decreases to 0  (3 * 2).  1 is added for when the color goes back to red.

    // Range values. RGB values range from 0 to 255.
    for (let i = 0; i < range.length; i++) range[i] = i * 255;

    // RGB values
    const l = range.length-1;
    rgb = rgb.map((e, i) => {
      // The ranges's index value. The value loops around.
      const index = (offset, j = (i * 2 + offset)) => (i === rgb.length-1 && j === l) ? l : (j % l);

      // The rgb values change if the input value is within the specific ranges
      if (value >= range[index(4)] && value < range[index(5)]+1) {

        return (value - range[index(4)]);

      } else if (value >= range[index(5)] && value < range[index(1)]+1) {

        return range[1];

      } else if (i === 0 && (value >= range[5] || (value >= range[0] && value < range[1]+1))) {

        return range[1];
      
      } else if (value >= range[index(1)] && value < range[index(2)]+1) {

        return (range[index(2)] - value);

      } else {

        return range[0];
        
      }
    });

    const r = rgb[0], g = rgb[1], b = rgb[2], hex = RGBtoHex(r, g, b);
    this.setState({ gradientHue: { r, g, b, hex } });

    // The selected color and the canvas are updated.
    this.getColor({canvas, e, fire: true});
    this.setCanvas({canvas, e, hex});
  }

  setCanvas = ({canvas, e, hex}) => {
    this.setGradientColor(canvas, hex);
    this.drawCircle(canvas, e);
  }

  setGradientColor = (canvas, hex = this.state.gradientHue.hex ) => {  // The default hex color is the color stored in state. 
    const context = canvas.getContext('2d');
    
    // White linear gradient
    const whiteGrd = context.createLinearGradient(0, 0, canvas.width, 0);
    whiteGrd.addColorStop(0.01, "#fff");
    whiteGrd.addColorStop(0.99, hex);
    context.fillStyle = whiteGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Black linear gradient
    const blackGrd = context.createLinearGradient(0, canvas.height, 0, 0);
    blackGrd.addColorStop(0.01, "#000");
    blackGrd.addColorStop(0.99, "transparent");
    context.fillStyle = blackGrd;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawCircle = (canvas, e) => {
    const context = canvas.getContext('2d');
    const { color, gradientHue } = this.state;

    // Arc values
    const initialPos = { x: color.x, y: color.y };
    const pos = getPosition(canvas, e, initialPos);
    const x = pos.x, y = pos.y;
    const radius = 5;
    
    // Stroke Color
    const limit = { x: Math.floor(canvas.width/2), y: Math.floor(canvas.height/3) };  // Values for where the stroke color should change
    let isLighter = /^([a-f])$/.test( gradientHue.hex[3] );  // The fourth character in the hexidecimal string is tested to see if the gradient hue is one of the lighter colors (colors between orange and light blue)
    isLighter = (x < limit.x || isLighter) && y < limit.y;
    const strokeColor = isLighter ? '#000' : '#fff';  // The stroke is black if it's in a lighter color and white if it's not.

    // Circle
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.strokeStyle = strokeColor;
    context.stroke();

    // The path is reset, so it's not connected to the next path.
    context.beginPath();
  }

  updateMousePosition = (e) => {
    if (e && e.clientX && e.clientY) {
      this.setState({ mouse: { x: e.clientX, y: e.clientY } });
    }
  }

  detectCanvas = (bool) => {
    this.setState({ inCanvas: bool});
  }

  render() {
    return (
      <HueGradient
        state={ this.state }
        initCanvas={ this.initCanvas }
        engage={ this.engage }
        disengage={ this.disengage }
        getColor={ this.getColor }
        changeHue={ this.changeHue }
        updateMousePosition={ this.updateMousePosition }
        detectCanvas={ this.detectCanvas }
        {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  color: state.color
});

const mapDispatchToProps = {
  selectColor,
  updateColor
};

export default connect(mapStateToProps, mapDispatchToProps)(HueGradientCntr);
