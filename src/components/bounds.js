import { Component } from '../core/index.js';

class Bounds extends Component
{
  constructor ( t, r, b, l, rigidity, friction )
  {
    super( );

    this.t = t;
    this.r = r;
    this.b = b;
    this.l = l;
    this.rigidity = rigidity;
    this.friction = friction;
  }
}

export default Bounds;