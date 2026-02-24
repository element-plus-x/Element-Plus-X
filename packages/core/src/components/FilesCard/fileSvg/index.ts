import type { Component } from 'vue';
import type { FilesType } from '../types';
import audio from './audio.vue';
import code from './code.vue';
import database from './database.vue';
import excel from './excel.vue';
import file from './file.vue';
import image from './image.vue';
import link from './link.vue';
import mark from './mark.vue';
import pdf from './pdf.vue';
import ppt from './ppt.vue';
import three from './three.vue';
import txt from './txt.vue';
import unknown from './unknown.vue';
import video from './video.vue';
import word from './word.vue';
import zip from './zip.vue';

export default {
  // 文档类
  word,
  excel,
  ppt,
  pdf,
  txt,
  mark,
  // 图片类
  image,
  // 音频类
  audio,
  // 视频类
  video,
  // 3D 模型类
  three,
  // 可执行程序类
  code,
  // 数据库类
  database,
  // 链接文件类
  link,
  // 压缩包类
  zip,
  // 通用文件/文件夹类
  file,
  // 未知文件类
  unknown
} as Record<FilesType, Component>;
