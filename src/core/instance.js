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

export default Instance;