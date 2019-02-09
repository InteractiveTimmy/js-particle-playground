import { UUID } from '../utils/index.js';

class System
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: {
        value: UUID( ),
        writable: false
      },
      entities: {
        value: [ ],
        writable: false
      }
    } );
  }
}

export default System;