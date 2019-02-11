import { Component } from '../core/index.js';

class Model extends Component
{
  constructor ( type, data, fill, stroke )
  {
    super( );

    this.type = type;
    this.data = data;
    this.fill = fill;
    this.stroke = stroke;
  }
}

export default Model;