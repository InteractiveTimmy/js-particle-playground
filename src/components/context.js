import { Component } from '../core/index.js';

class Context extends Component
{
  constructor ( context )
  {
    super( );

    this.data = context;
  }
}

export default Context;