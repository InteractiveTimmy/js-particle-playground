import { System } from '../core/index.js';
import { Position, Velocity, Bounds } from '../components/index.js';

class Bounder extends System
{
  constructor ( )
  {
    super( );

    this.components.push( Position, Velocity, Bounds );
  }

  onUpdate ( dt )
  {
    this.entities.forEach( ( entity ) => {
      if ( entity.position.x < entity.bounds.l )
      {
        entity.position.x = entity.bounds.l;
        entity.velocity.x *= -1 * entity.bounds.rigidity;
        entity.velocity.y *= entity.bounds.friction
      }
      else if ( entity.position.x > entity.bounds.r )
      {
        entity.position.x = entity.bounds.r;
        entity.velocity.x *= -1 * entity.bounds.rigidity;
        entity.velocity.y *= entity.bounds.friction
      }

      if ( entity.position.y < entity.bounds.t )
      {
        entity.position.y = entity.bounds.t;
        entity.velocity.y *= -1 * entity.bounds.rigidity;
        entity.velocity.x *= entity.bounds.friction
      }
      else if ( entity.position.y > entity.bounds.b )
      {
        entity.position.y = entity.bounds.b;
        entity.velocity.y *= -1 * entity.bounds.rigidity;
        entity.velocity.x *= entity.bounds.friction
      }
    } );
  }
}

export default Bounder;