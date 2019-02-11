import { Component } from '../core/index.js';

class Position extends Component
{
  constructor ( x = 0, y = 0 )
  {
    super( );

    this.x = x;
    this.y = y;
  }
}

export default Position;