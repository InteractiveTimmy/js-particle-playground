import { System, Entity } from '../core/index.js';
import { Position, Connection, Color, Model, Context } from '../components/index.js';
import { distanceTo } from '../math/index.js';

class Connector extends System
{
  constructor ( )
  {
    super( );

    this.components.push( Position, Connection, Color );
    this.connections = [ ];
  }

  onUpdate ( dt )
  {
    this.entities.forEach( ( entityA ) => {
      this.entities.forEach( ( entityB ) => {
        if ( entityA !== entityB )
        {
          if ( distanceTo( entityA.position, entityB.position ) < entityA.connection.maxLength && !entityA.connection.connections.includes( entityB ) )
          {
            console.log( entityA.connection.connectors.length );
            this.instance.loadEntities(
              new Entity( ).load(
                new Position( ),
                new Color( ),
                new Model( 'line', [ entityA.position, entityB.position ], false, true ),
                new Context( entityA.context.data )
              )
            );

            entityA.connection.connections.push( entityB );
            entityA.connection.connectors.push( this.instance.entities[this.instance.entities.length - 1] );
          }
          else if ( entityA.connection.connections.includes( entityB ) )
          {
            console.log( 'hi' );
            entityA.connection.connections.splice(
              entityA.connection.connections.indexOf( entityB ), 1
            );

            console.log( entityA.connection.connectors[entityA.connection.connections.indexOf( entityB )] );

            this.instance.unloadEntities( entityA.connection.connectors[entityA.connection.connections.indexOf( entityB )] )
            entityA.connection.connectors.splice(
              entityA.connection.connections.indexOf( entityB ), 1
            );
          }
        }

      } );
    } );
  }
}

export default Connector;