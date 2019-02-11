import { Component } from '../core/index.js';

class Color extends Component
{
  constructor ( fr = 0, fg = 0, fb = 0, fa = 1.0, sr = 0, sg = 0, sb = 0, sa = 1.0 )
  {
    super( );

    this.fr = fr; this.fg = fg; this.fb = fb; this.fa = fa;
    this.sr = sr; this.sg = sg; this.sb = sb; this.sa = sa;
  }
}

export default Color;