(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.SPT = {}));
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
	      children: {
	        value: [ ],
	        writable: false
	      }
	    } );
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
	      }
	    } );
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

	  step ( )
	  {

	  }
	}

	exports.Component = Component;
	exports.Entity = Entity;
	exports.System = System;
	exports.Instance = Instance;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
