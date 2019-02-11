'use strict';

let myInstance = new JPP.Instance( );
let myEntities = [ ];
let mySystems = [ ];

function createEntities ( )
{
  let myEntity;

  myEntities = [ ];

  for ( let i = 0; i < 3; i++ )
  {
    myEntity = new JPP.Entity( );

    myEntity.load(
      new JPP.components.Color(
        config.particlesColor.red, config.particlesColor.green, config.particlesColor.blue, 1.0,
        config.connectColor.red, config.connectColor.green, config.connectColor.blue, 1.0
      ),
      new JPP.components.Context( config.ctx ),
      new JPP.components.Model( 'circle', '10', true, true ),
      new JPP.components.Position( 100, 100 ),
      new JPP.components.Bounds( 0, config.canvas.width, config.canvas.height, 0, 0.7, 1 ),
      new JPP.components.Velocity( Math.random( ) * 5, Math.random( ) * 5 ),
      new JPP.components.Connection( 100 )
    );

    myEntities.push( myEntity );
  }
}

function updateEntities ( )
{
  myEntities.forEach( ( entity ) => {
    entity.unload( ...entity.components );

    entity.load(
      new JPP.components.Color(
        config.particlesColor.red, config.particlesColor.green, config.particlesColor.blue, 1.0,
        config.connectColor.red, config.connectColor.green, config.connectColor.blue, 1.0
      ),
      new JPP.components.Context( config.ctx ),
      new JPP.components.Model( 'circle', '10', true, true ),
      new JPP.components.Position( 100, 100 ),
      new JPP.components.Bounds( 0, config.canvas.width, config.canvas.height, 0, 1 ),
      new JPP.components.Velocity( Math.random( ), Math.random( ) )
    );
  } );
}

function createSystems ( )
{
  mySystems = [ ];

  mySystems.push( new JPP.systems.Render( config.canvas, config.ctx ) );
  mySystems.push( new JPP.systems.Movement( ) );
  mySystems.push( new JPP.systems.Bounder( ) );
  mySystems.push( new JPP.systems.Gravitation( ) );
  mySystems.push( new JPP.systems.Connector( ) );
}

function init ( )
{
  createEntities( );
  createSystems( );

  myInstance.loadSystems( ...mySystems );
  myInstance.loadEntities( ...myEntities );

  myInstance.start( );

  setTimeout( ( ) => {
    myInstance.stop( );
    console.log( myInstance.entities );
    myInstance.unloadEntities( ...myInstance.entities );
    setTimeout( ( ) => {
      console.log( myInstance.entities );
    }, 1000 );
  }, 1000 );
  
}