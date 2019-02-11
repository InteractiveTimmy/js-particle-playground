import { System } from '../core/index.js';
import { Context, Position, Color, Model } from '../components/index.js';

class Render extends System
{
  constructor ( canvas, context )
  {
    super( );

    this.components.push( Context, Position, Color, Model );

    this.canvas = canvas;
    this.context = context;
  }

  onUpdate ( dt )
  {
    this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );

    this.entities.forEach( ( entity ) => {
      switch( entity.model.type )
      {
        case 'circle':
          entity.context.data.beginPath( );
          entity.context.data.arc( entity.position.x, entity.position.y, entity.model.data, 0, 2 * Math.PI );
          entity.context.data.closePath( );

          if ( entity.model.fill )
          {
            entity.context.data.fillStyle = `rgba( ${entity.color.fr}, ${entity.color.fg}, ${entity.color.fb}, ${entity.color.fa} )`;
            entity.context.data.fill( );
          }

          if ( entity.model.stroke )
          {
            entity.context.data.strokeStyle = `rgba( ${entity.color.sr}, ${entity.color.sg}, ${entity.color.sb}, ${entity.color.sa} )`;
            entity.context.data.stroke( );
          }

          break;

          case 'line':
            entity.context.data.beginPath( );
            entity.context.data.moveTo( entity.model.data[0].x, entity.model.data[0].y );
            entity.context.data.lineTo( entity.model.data[1].x, entity.model.data[1].y );
            entity.context.data.closePath( );
            entity.context.data.strokeStyle = `rgba( ${entity.color.sr}, ${entity.color.sg}, ${entity.color.sb}, ${entity.color.sa} )`;
            entity.context.data.stroke( );
            
            break;
      }
    } );
  }
}

export default Render;