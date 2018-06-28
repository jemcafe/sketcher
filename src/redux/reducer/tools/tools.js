import { 
  SELECT_TOOL
} from './actions';

const initialState = {
  move: {
    selected: false,
    select: 'Layer'
  },
  eyedropper: {
    selected: false,
    sampleSize: 'Point Sample'
  },
  paintBrush: {
    selected: true,
    brush: 'Hard Round',
    radius: 10,
    opacity: 1
  },
  eraser: {
    selected: false,
    brush: 'Hard Round',
    radius: 10,
    opacity: 1
  },
  paintBucket: {
    selected: false,
    opacity: 1
  },
  pen: {
    selected: false,
    type: 'Path'
  },
  shape: {
    selected: false,
    type: 'Path',
  },
  magnify: {
    selected: false,
    in: true, 
    out: false
  }
};

// Reducer
export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_TOOL:
      return payload(state);
    default:
      return state;
  }
}
