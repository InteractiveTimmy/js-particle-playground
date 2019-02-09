import { UUID } from '../utils/index.js';

class Component
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: {
        value: UUID( ),
        writable: false
      }
    } );
  }
}

export default Component;