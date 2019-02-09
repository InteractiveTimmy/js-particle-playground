export default {
  input: 'src/jpp.js',
  output: [
    {
      format: 'umd',
      name: 'JPP',
      file: 'build/jpp.js',
      indent: '\t'
    },
    {
      format: 'umd',
      name: 'JPP',
      file: 'examples/jpp.js',
      indent: '\t'
    },
    {
      format: 'es',
      file: 'build/jpp.module.js',
      indent: '\t'
    }
  ],
  watch: {
    include: 'src/**'
  }
};