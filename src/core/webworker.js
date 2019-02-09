import { UUID } from '../utils/index.js';

class Webworker
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

  get isWebworker ( ) { return true; }
}

export default Webworker;