import { System } from '../core/index.js';
import { Velocity, Gravity } from '../components/index.js';

class Bounder extends System
{
  constructor ( )
  {
    super( );

    this.components.push( Velocity, Gravity );
  }

  onUpdate ( dt )
  {
    this.entities.forEach( ( entity ) => {
      entity.velocity.x -= entity.gravity.x;
      entity.velocity.y -= entity.gravity.y;
    } );
  }
}

export default Bounder;