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
      },
      components: {
        value: [ ],
        writable: false
      }
    } );
  }

  get isSystem ( ) { return true; }

  hasComponents ( entity )
  {
    return ( this.components.length > 0 && this.components.every( ( component ) => (
      entity.components.some( ( entComp ) => (
        entComp.constructor === component
      ) )
     ) ) );
  }

  validateEntities( ...entities )
  {
    entities.forEach( ( entity ) => {
      if ( this.hasComponents( entity ) )
      {
        if ( !this.entities.includes( entity ) )
        { this.entities.push( entity ); }
      }
      else if ( this.entities.includes( entity ) )
        { this.entities.splice( this.entities.indexOf( entity ), 1 ); }
    } );

    return this;
  }

  update ( dt )
  { this.onUpdate( dt ); }

  onUpdate ( dt )
  { }
}

export default System;