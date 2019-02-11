import { System } from '../core/index.js';
import { Position, Velocity } from '../components/index.js';

class Movement extends System
{
  constructor ( )
  {
    super( );

    this.components.push( Position, Velocity );
  }

  onUpdate ( dt )
  {
    this.entities.forEach( ( entity ) => {
      entity.position.x += entity.velocity.x;
      entity.position.y += entity.velocity.y;
    } );
  }
}

export default Movement;