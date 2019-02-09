import { System } from '../core/index.js';
import { TestComponent } from '../components/index.js';

class TestSystem extends System
{
  constructor ( )
  {
    super( );

    this.components.push( TestComponent )
  }
}

export default TestSystem;