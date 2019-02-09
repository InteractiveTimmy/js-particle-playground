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

export default UUID;