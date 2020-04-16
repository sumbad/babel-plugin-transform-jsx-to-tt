import { Options } from './interfaces';

export const voidElements = [
  'area',
  'base',
  'basefont',
  'bgsound',
  'br',
  'col',
  'command',
  'embed',
  'frame',
  'hr',
  'image',
  'img',
  'input',
  'isindex',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'nextid',
  'param',
  'source',
  'track',
  'wbr'
];

// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
export const mappingAttrPresetGlobal: Options['attributes'] = [
  {
    prefix: '',
    attributes: [
      '.*-.*',
      'role',
      'accesskey',
      'autocapitalize',
      'class',
      'contenteditable',
      'contextmenu',
      'dir',
      'dropzone',
      'exportparts',
      'id',
      'inputmode',
      'is',
      'itemid',
      'itemprop',
      'itemref',
      'itemscope',
      'itemtype',
      'lang',
      'part',
      'slot',
      'style',
      'tabindex',
      'title',
      'translate'
    ]
  }
];

export const mappingAttrPresetLit: Options['attributes'] = [
  {
    prefix: '@',
    attributes: ['on.*'],
    replace: 'on'
  },
  {
    preset: 'global'
  },
  {
    prefix: '?',
    attributes: ['hidden', 'draggable', 'spellcheck']
  },
  {
    prefix: '.',
    attributes: ['.*']
  }
];
