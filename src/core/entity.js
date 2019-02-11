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
      components: {
        value: [ ],
        writable: false
      }
    } );
  }

  get isEntity ( ) { return true; }

  load ( ...components )
  {
    components.forEach( ( component ) => {
      if ( !this.components.includes( component ) && component.isComponent && !this[component.constructor.name.toLowerCase( )] )
      {
        if ( component.entity )
        { component.entity.unload( component ); }

        component.entity = this;

        this.components.push( component );
        this[component.constructor.name.toLowerCase( )] = component;

        if ( this.instance )
        {
          this.instance.systems.forEach( ( system ) => {
            system.validateEntities( this );
          } );
        }
      }
    } );

    return this;
  }

  unload ( ...components )
  {
    components.forEach( ( component ) => {
      if ( this.components.includes( component ) )
      {
        this[component.constructor.name.toLowerCase( )] = null;
        this.components.splice( this.components.indexOf( component ), 1 );
        component.parent = null;
      }

      if ( this.instance )
        {
          this.instance.systems.forEach( ( system ) => {
            system.validateEntities( this );
          } );
        }
    } );

    return this;
  }
}

export default Entity;