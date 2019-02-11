export default ( vecA, vecB ) =>
{ return Math.sqrt( Math.pow( ( vecB.x - vecA.x ), 2 ) + Math.pow( ( vecB.y - vecA.y ), 2 ) ); }