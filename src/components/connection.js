import { Component } from '../core/index.js';

class Connection extends Component
{
  constructor ( ml = 0 )
  {
    super( );

    this.maxLength = ml
    this.connections = [ ];
    this.connectors = [ ];
  }
}

export default Connection;