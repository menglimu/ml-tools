import config from './../rollup.config'
import run from '@rollup/plugin-run';
config.plugins.push(run())
config.output.dir = 'runtime'

export default config