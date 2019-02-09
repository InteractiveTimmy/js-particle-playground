import { UUID } from '../utils/index.js';

class Entity
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: {
        value: UUID( ),
        writable: false
      },
      children: {
        value: [ ],
        writable: false
      }
    } );
  }
}

export default Entity;