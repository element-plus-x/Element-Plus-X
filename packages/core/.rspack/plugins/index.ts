import type { Plugins } from '@rspack/core';
import { VueLoaderPlugin } from 'vue-loader';
import autoImport from './audoImport';

const plugins: Plugins = [new VueLoaderPlugin(), ...autoImport];

export default plugins;
