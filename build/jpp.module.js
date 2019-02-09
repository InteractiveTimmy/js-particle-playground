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
      if ( !this.components.includes( component ) && component.isComponent )
      {
        if ( component.entity )
        { component.entity.unload( component ); }

        component.entity = this;

        this.components.push( component );

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

  step ( )
  {

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

class TestComponent extends Component
{
  constructor ( )
  {
    super( );

    this.x = 5;
    this.y = 6;
  }
}



var index = /*#__PURE__*/Object.freeze({
	TestComponent: TestComponent
});

class TestSystem extends System
{
  constructor ( )
  {
    super( );

    this.components.push( TestComponent );
  }
}



var index$1 = /*#__PURE__*/Object.freeze({
	TestSystem: TestSystem
});

export { index as components, index$1 as systems, Component, Entity, System, Instance, Webworker };
