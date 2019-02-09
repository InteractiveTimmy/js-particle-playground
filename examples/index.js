'use strict';

let logicalProcessors = window.navigator.hardwareConcurrency
console.log( logicalProcessors );

let config = { };

// dom modifiers -- begin
function toggleMenu ( )
{
  const elmTM = document.querySelector( '#target-menu' );
  const elmMC = document.querySelector( '#menu-container' );

  elmTM.className = ( elmTM.className === 'tm-open' ) ? 'tm-closed' : 'tm-open';
  elmMC.className = ( elmMC.className === 'container mc-open' ) ? 'container mc-closed' : 'container mc-open';

  setTimeout( handleResize, 1000 );
}

document.onreadystatechange = ( ) => {
  if ( document.readyState === 'complete' )
  {
    const logicalProcessors = window.navigator.hardwareConcurrency;

    const elmWWC = document.querySelector( '#input-webworker-count' );
    elmWWC.max = logicalProcessors;
    elmWWC.value = logicalProcessors;

    console.log( elmWWC );

    applyModifications( );

    config.canvas = document.querySelector( 'canvas' );
    config.ctx = config.canvas.getContext( '2d' );

    const form = document.querySelector( 'form' );

    form.addEventListener( 'submit', applyModifications );
    config.canvas.addEventListener( 'mousemove', readMouse );
    window.addEventListener( 'resize', handleResize );
  }
};

function applyModifications ( e )
{
  if ( e ) { e.preventDefault( ); }

  config.particlesColor =
  {
    red: document.querySelector( '#input-particle-color-red' ).value,
    green: document.querySelector( '#input-particle-color-green' ).value,
    blue: document.querySelector( '#input-particle-color-blue' ).value
  };
  
  config.connectColor =
  {
    red: document.querySelector( '#input-connect-color-red' ).value,
    green: document.querySelector( '#input-connect-color-green' ).value,
    blue: document.querySelector( '#input-connect-color-blue' ).value
  };

  config.backgroundColor =
  {
    red: document.querySelector( '#input-background-color-red' ).value,
    green: document.querySelector( '#input-background-color-green' ).value,
    blue: document.querySelector( '#input-background-color-blue' ).value
  };

  config.particleAmount = document.querySelector( '#input-particle-amount' ).value;
  
  config.maxVelocity =
  {
    x: document.querySelector( '#input-velocity-x' ).value,
    y: document.querySelector( '#input-velocity-y' ).value
  };

  config.gravity =
  {
    x: document.querySelector( '#input-gravity-x' ).value,
    y: document.querySelector( '#input-gravity-y' ).value
  };

  config.connectRatio = document.querySelector( '#input-connect-ratio' ).value;
  config.webWorkers = document.querySelector( '#input-webworker-count' ).value;

  config.useWebworkers = document.querySelector( '#input-use-webworkers' ).checked;
  config.followMouse = document.querySelector( '#input-follow-mouse' ).checked;
  config.connectMouse = document.querySelector( '#input-connect-mouse' ).checked;
  config.hotspotMouse = document.querySelector( '#input-hotspot-mouse' ).checked;

  console.log( 'changed config', config );
}

function readMouse ( e )
{
  e.preventDefault( );

  config.mouseLocation = {
    x: e.clientX,
    y: e.clientY
  };
}

function handleResize ( e ) 
{
  config.canvas.width = config.canvas.parentElement.clientWidth;
  config.canvas.height = config.canvas.parentElement.clientHeight;

  console.log( config.canvas.width, config.canvas.height );
}
// dom modifiers -- end
