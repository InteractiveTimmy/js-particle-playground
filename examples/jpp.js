(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.JPP = {}));
}(this, function (exports) { 'use strict';

	let arr = [ ];

	for ( let i = 0; i < 256; i++ )
	{ arr[i] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 ); }

	let UUID = ( ) =>
	{
	  let a = Math.random( ) * 0xffffffff | 0;
	  let b = Math.random( ) * 0xffffffff | 0;
	  let c = Math.random( ) * 0xffffffff | 0;
	  let d = Math.random( ) * 0xffffffff | 0;

	  let o =
	    arr[ a & 0xff ] + arr[ a >> .8 & 0xff ] + arr[ a >> 16 & 0xff ] + arr[ a >> 24 & 0xff ] + '-' +
	    arr[ b & 0xff ] + arr[ b >> 8 & 0xff ] + '-' + arr[ b >> 16 & 0x0f | 0x40 ] + arr[ b >> 24 & 0xff ] + '-' +
	    arr[ c & 0x3f | 0x80 ] + arr[ c >> 8 & 0xff ] + '-' + arr[ c >> 16 & 0xff ] + arr[ c >> 24 & 0xff ] +
	    arr[ d & 0xff ] + arr[ d >> 8 & 0xff ] + arr[ d >> 16 & 0xff ] + arr[ d >> 24 & 0xff ];

	  return o.toUpperCase( );
	};

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

	  get isComponent ( ) { return true; }
	}

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
	      },
	      stats: {
	        value: { },
	        writable: false
	      }
	    } );
	  }

	  get isInstance ( ) { return true; }

	  load ( ...items )
	  {
	    items.forEach( ( item ) => {
	      if ( item.isEntity )
	      { this.loadEntities( item ); }
	      else if ( item.isSystem )
	      { this.loadSystems( item ); }
	      else if ( item.isWebworker )
	      { this.loadWebworkers( item ); }
	    } );

	    return this;
	  }

	  unload ( ...items )
	  {
	    items.forEach( ( item ) => {
	      if ( item.isEntity )
	      { this.unloadEntities( item ); }
	      else if ( item.isSystem )
	      { this.unloadSystems( item ); }
	      else if ( item.isWebworker )
	      { this.unloadWebworkers( item ); }
	    } );

	    return this;
	  }

	  loadEntities ( ...entities )
	  {
	    entities.forEach( ( entity ) => {
	      if ( entity.instance ) { entity.instance.unloadEntity( entity ); }
	      entity.instance = this;

	      this.systems.forEach( ( system ) => {
	        system.validateEntities( entity );
	      } );

	      this.entities.push( entity );
	    } );

	    return this;
	  }

	  unloadEntities ( ...entities )
	  {
	    entities.forEach( ( entity ) => {
	      if ( this.entities.includes( entity ) )
	      {
	        entity.instance = null;

	        this.systems.forEach( ( system ) => {
	          if ( system.entities.includes( entity ) )
	          { system.entities.splice( system.entities.indexOf( entity ), 1 ); }
	        } );

	        this.entities.splice( this.entities.indexOf( entity, 1 ) );
	      }
	    } );

	    return this;
	  }

	  loadSystems ( ...systems )
	  {
	    systems.forEach( ( system ) => {
	      if ( system.instance ) { system.instance.unloadSystem( system ); }
	      system.instance = this;

	      system.validateEntities( ...this.entities );

	      this.systems.push( system );
	    } );

	    return this;
	  }

	  unloadSystems ( ...systems )
	  {
	    systems.forEach( ( system ) => {

	    } );

	    return this;
	  }

	  loadWebworkers ( ...webworkers )
	  {
	    webworkers.forEach( ( webworker, i ) => {
	      webworker.instance.unloadWebworkers( webworker );
	      webworker.instance = this;

	      webworkers.push( this );
	    } );

	    return this;
	  }

	  start ( )
	  {
	    if ( this.stats.active ) { return; }

	    this.stats.active = true;
	    this.step( );
	  }

	  stop ( )
	  {
	    if ( !this.stats.active ) { return; }

	    this.stats.active = false;
	  }

	  step ( )
	  {
	    if ( this.stats.active )
	    { setTimeout( ( ) => { this.step( ); } ); }

	    this.systems.forEach( ( system ) => {
	      system.update( );
	    } );
	  }
	}

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

	class Bounds extends Component
	{
	  constructor ( t, r, b, l, rigidity, friction )
	  {
	    super( );

	    this.t = t;
	    this.r = r;
	    this.b = b;
	    this.l = l;
	    this.rigidity = rigidity;
	    this.friction = friction;
	  }
	}

	class Color extends Component
	{
	  constructor ( fr = 0, fg = 0, fb = 0, fa = 1.0, sr = 0, sg = 0, sb = 0, sa = 1.0 )
	  {
	    super( );

	    this.fr = fr; this.fg = fg; this.fb = fb; this.fa = fa;
	    this.sr = sr; this.sg = sg; this.sb = sb; this.sa = sa;
	  }
	}

	class Connection extends Component
	{
	  constructor ( ml = 0 )
	  {
	    super( );

	    this.maxLength = ml;
	    this.connections = [ ];
	    this.connectors = [ ];
	  }
	}

	class Context extends Component
	{
	  constructor ( context )
	  {
	    super( );

	    this.data = context;
	  }
	}

	class Gravity extends Component
	{
	  constructor ( x = 0, y = 0 )
	  {
	    super( );

	    this.x = x;
	    this.y = y;
	  }
	}

	class Position extends Component
	{
	  constructor ( x = 0, y = 0 )
	  {
	    super( );

	    this.x = x;
	    this.y = y;
	  }
	}

	class Model extends Component
	{
	  constructor ( type, data, fill, stroke )
	  {
	    super( );

	    this.type = type;
	    this.data = data;
	    this.fill = fill;
	    this.stroke = stroke;
	  }
	}

	class Velocity extends Component
	{
	  constructor ( x = 0, y = 0 )
	  {
	    super( );

	    this.x = x;
	    this.y = y;
	  }
	}



	var index = /*#__PURE__*/Object.freeze({
		Bounds: Bounds,
		Color: Color,
		Connection: Connection,
		Context: Context,
		Gravity: Gravity,
		Position: Position,
		Model: Model,
		Velocity: Velocity
	});

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
	        entity.velocity.y *= entity.bounds.friction;
	      }
	      else if ( entity.position.x > entity.bounds.r )
	      {
	        entity.position.x = entity.bounds.r;
	        entity.velocity.x *= -1 * entity.bounds.rigidity;
	        entity.velocity.y *= entity.bounds.friction;
	      }

	      if ( entity.position.y < entity.bounds.t )
	      {
	        entity.position.y = entity.bounds.t;
	        entity.velocity.y *= -1 * entity.bounds.rigidity;
	        entity.velocity.x *= entity.bounds.friction;
	      }
	      else if ( entity.position.y > entity.bounds.b )
	      {
	        entity.position.y = entity.bounds.b;
	        entity.velocity.y *= -1 * entity.bounds.rigidity;
	        entity.velocity.x *= entity.bounds.friction;
	      }
	    } );
	  }
	}

	var distanceTo = ( vecA, vecB ) =>
	{ return Math.sqrt( Math.pow( ( vecB.x - vecA.x ), 2 ) + Math.pow( ( vecB.y - vecA.y ), 2 ) ); };

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

	            this.instance.unloadEntities( entityA.connection.connectors[entityA.connection.connections.indexOf( entityB )] );
	            entityA.connection.connectors.splice(
	              entityA.connection.connections.indexOf( entityB ), 1
	            );
	          }
	        }

	      } );
	    } );
	  }
	}

	class Bounder$1 extends System
	{
	  constructor ( )
	  {
	    super( );

	    this.components.push( Velocity, Gravity );
	  }

	  onUpdate ( dt )
	  {
	    this.entities.forEach( ( entity ) => {
	      entity.velocity.x -= entity.gravity.x;
	      entity.velocity.y -= entity.gravity.y;
	    } );
	  }
	}

	class Movement extends System
	{
	  constructor ( )
	  {
	    super( );

	    this.components.push( Position, Velocity );
	  }

	  onUpdate ( dt )
	  {
	    this.entities.forEach( ( entity ) => {
	      entity.position.x += entity.velocity.x;
	      entity.position.y += entity.velocity.y;
	    } );
	  }
	}

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



	var index$1 = /*#__PURE__*/Object.freeze({
		Bounder: Bounder,
		Connector: Connector,
		Gravitation: Bounder$1,
		Movement: Movement,
		Render: Render
	});

	exports.components = index;
	exports.systems = index$1;
	exports.Component = Component;
	exports.Entity = Entity;
	exports.System = System;
	exports.Instance = Instance;
	exports.Webworker = Webworker;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
