import { Component } from '../core/index.js';

class Velocity extends Component
{
  constructor ( x = 0, y = 0 )
  {
    super( );

    this.x = x;
    this.y = y;
  }
}

export default Velocity;