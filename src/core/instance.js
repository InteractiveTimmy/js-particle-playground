import { UUID } from '../utils/index.js';

class Instance
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: {
        value: UUID( ),
        writable: false
      },
      systems: {
        value: [ ],
        writable: false
      },
      entities: {
        value: [ ],
        writable: false
      },
      webworkers: {
        value: [ ],
        writable: false
      }
    } );
  }

  step ( )
  {

  }
}

export default Instance;