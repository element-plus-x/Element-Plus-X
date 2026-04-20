---
title: 'BubbleList'
---

::: warning
`1.1.6 鐗堟湰` 缁ф壙鎵撳瓧鍣?**闆惧寲** 鏁堟灉銆傛柊澧?**婊氬姩搴曢儴鎸夐挳锛屼豢 `璞嗗寘`馃敟**銆傛柊澧?\**榧犳爣鎮仠灞曠ず婊氬姩鏉?*锛屽寮轰氦浜掍綋楠屻€傝鍙婃椂鏇存柊灏濊瘯

馃惖 姝ゆ俯棣ㄦ彁绀烘洿鏂版椂闂达細`2025-04-13`
:::

::: tip
鍙? 鏂扮増鏈殑鑷姩婊氬姩锛屽湪 `list` 闀垮害鍙樺寲鏃讹紝鑷姩婊氬姩銆備絾鏄?鍚戜笂婊氬姩婊氬姩鏉″悗锛岄渶瑕佹墜鍔ㄨ皟鐢?`scrollToBottom` 鏂规硶锛屼互鍐嶆瀹炵幇鑷姩婊氬姩銆傛垨鑰?婊氬姩鏉℃粴鍔ㄥ埌搴曢儴鍚庯紝浼氶噸鏂拌Е鍙戣嚜鍔ㄦ粴鍔ㄣ€?
鍜屽師鏉ラ€昏緫涓€鏍? 鍗囩骇鏃犻渶浠讳綍蹇冪悊璐熸媴銆?:::

## 浠嬬粛

`BubbleList` 渚濊禆浜?`Bubble` 缁勪欢锛岀敤浜庡睍绀轰竴缁勫璇濇皵娉″垪琛ㄣ€傝缁勪欢鏀寔璁剧疆 `鍒楄〃鏈€澶ч珮搴锛屽叿澶?`鑷姩婊氬姩` 鍔熻兘銆傚悓鏃讹紝瀹冭繕鎻愪緵浜嗗绉?`鎺у埗婊氬姩` 鐨勬柟娉曪紝`浣跨敤鑰卄 鍙互杞绘澗璋冪敤锛屾€ц兘寮哄ぇ锛屾棤闇€浠讳綍寮€鍙戝績鐞嗚礋鎷呫€?

## 浠ｇ爜婕旂ず

### 鍩烘湰浣跨敤

<demo src="./demos/list.vue"></demo>

### 鑷畾涔夊垪琛?

<demo src="./demos/customized.vue"></demo>

### 鑷姩婊氬姩銆佹寚瀹氭粴鍔ㄤ綅缃?

<demo src="./demos/scroll-to.vue"></demo>

### 杩斿洖椤堕儴鎸夐挳

<demo src="./demos/back-button.vue"></demo>

### 鑷畾涔変富棰?

閫氳繃 `ConfigProvider.themeOverrides` 瑕嗙洊 `BubbleList` 鐨勪富棰樺彉閲忋€傚畬鏁村彉閲忚〃涓庡彲澶嶅埗妯℃澘瑙侊細

- [涓婚鍙橀噺鎬昏〃](/zh/guide/theme-tokens#bubblelist)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

<demo src="./demos/theme-overrides.vue"></demo>

### 涓?x-markdown-vue 缁撳悎浣跨敤

浠?`v2.0.0` 寮€濮嬶紝缁勪欢搴撲笉鍐嶅唴缃?`XMarkdown` / `XMarkdownAsync`銆傚闇€ Markdown 娓叉煋锛岃浣跨敤鐙珛鍖?[x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)锛屾垨鏌ョ湅涓撳睘鏂囨。锛歔XMarkdown](/zh/components/xMarkdown/)銆?

#### 瀹夎

```bash
pnpm add x-markdown-vue
pnpm add katex
pnpm add shiki shiki-stream
```

::: tip
濡傛灉闇€瑕佷唬鐮佸潡璇硶楂樹寒鍔熻兘锛岃瀹夎 `shiki` 鍜?`shiki-stream`銆傚惁鍒欐帶鍒跺彴鍙兘浼氭姤閿欙細`Streaming highlighter initialization failed: Error: Failed to load shiki-stream module`
:::

#### 鍩虹鐢ㄦ硶

<demo src="./demos/with-markdown.vue"></demo>

#### 娴佸紡娓叉煋

閫氳繃璁剧疆 `enable-animate` 灞炴€э紝鍙互瀹炵幇鎵撳瓧鏈烘晥鏋滐細

```vue
<template>
  <BubbleList :list="list">
    <template #content="{ item }">
      <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
    </template>
  </BubbleList>
</template>

<script setup>
import { ref } from 'vue';
import { BubbleList } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const list = ref([
  { content: '', placement: 'start' } // 娴佸紡鍐呭浼氬姩鎬佹洿鏂?]);
</script>
```

## 灞炴€?

| 灞炴€у悕              | 绫诲瀷                                         | <div style="width: 70px">鏄惁蹇呭～</div> | 榛樿鍊?                                       | 璇存槑                                                                                                                                                                                                                                           |
| --------------------- | ---------------------------------------------- | ------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `list`                | Array                                          | 鏄?                                        | 鏃?                                            | 鍖呭惈姘旀场淇℃伅鐨勬暟缁勶紝姣忎釜鍏冪礌涓轰竴涓璞★紝鍖呭惈 `content`銆乣placement`銆乣loading`銆乣shape`銆乣variant` 绛?`Bubble` 灞炴€э紝鐢ㄤ簬閰嶇疆姣忎釜姘旀场鐨勬樉绀哄唴瀹瑰拰鏍峰紡銆侻arkdown 鍦烘櫙鍙厤鍚?`#content` 鎻掓Ы娓叉煋銆? |
| `autoScroll`          | Boolean                                        | 鍚?                                        | true                                           | 鏄惁寮€鍚嚜鍔ㄦ粴鍔ㄣ€?                                                                                                                                                                                                                        |
| `maxHeight`           | String                                         | 鍚?                                        | -                                              | 姘旀场鍒楄〃list鐨勬渶澶ч珮搴?榛樿缁ф壙wrapper瀹瑰櫒楂樺害)銆?                                                                                                                                                                                  |
| `alwaysShowScrollbar` | Boolean                                        | 鍚?                                        | false                                          | 鏄惁涓€鐩存樉绀烘粴鍔ㄦ潯锛岄粯璁や负 `false`銆?                                                                                                                                                                                                |
| `backButtonThreshold` | Number                                         | 鍚?                                        | 80                                             | 杩斿洖搴曢儴鎸夐挳鏄剧ず闃堝€硷紝褰撴粴鍔ㄦ潯璺濈搴曢儴澶т簬璇ュ€兼椂锛屼細鏄剧ず杩斿洖搴曢儴鎸夐挳銆?                                                                                                                                          |
| `showBackButton`      | Boolean                                        | 鍚?                                        | true                                           | 鏄惁鏄剧ず杩斿洖搴曢儴鎸夐挳锛岄粯璁や负 `true`銆?                                                                                                                                                                                              |
| `backButtonPosition`  | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | 鍚?                                        | `{ bottom: '20px', left: 'calc(50% - 19px)' }` | 杩斿洖搴曢儴鎸夐挳鐨勪綅缃? 榛樿搴曢儴灞呬腑灞曠ず銆?                                                                                                                                                                                           |
| `btnLoading`          | Boolean                                        | 鍚?                                        | true                                           | 鏄惁寮€鍚繑鍥炲簳閮ㄦ寜閽?loading 鐘舵€侊紝榛樿涓?`true`銆?                                                                                                                                                                                   |
| `btnColor`            | String                                         | 鍚?                                        | '#409EFF'                                      | 杩斿洖搴曢儴鎸夐挳鐨勯鑹诧紝榛樿涓?`'#409EFF'`銆?                                                                                                                                                                                              |
| `btnIconSize`         | Number                                         | 鍚?                                        | 24                                             | 杩斿洖搴曢儴鎸夐挳鐨勫浘鏍囧ぇ灏忥紝榛樿涓?24px銆?                                                                                                                                                                                              |

## 浜嬩欢

## Ref 瀹炰緥鏂规硶

| 灞炴€у悕         | 绫诲瀷   | 鎻忚堪                              |
| ---------------- | -------- | ----------------------------------- |
| `scrollToTop`    | Function | 婊氬姩鍒伴《閮ㄣ€?                  |
| `scrollToBottom` | Function | 婊氬姩鍒板簳閮ㄣ€?                  |
| `scrollToBubble` | Function | 婊氬姩鍒版寚瀹氭皵娉＄储寮曚綅缃€? |

## 鎻掓Ы

| 鎻掓Ы鍚?   | 鍙傛暟 | 绫诲瀷 | 鎻忚堪                                |
| ---------- | ------ | ------ | ------------------------------------- |
| `#avatar`  | -      | Slot   | 鑷畾涔夊ご鍍忓睍绀哄唴瀹?            |
| `#header`  | -      | Slot   | 鑷畾涔夋皵娉￠《閮ㄥ睍绀哄唴瀹?      |
| `#content` | -      | Slot   | 鑷畾涔夋皵娉″睍绀哄唴瀹?             |
| `#loading` | -      | Slot   | 鑷畾涔夋皵娉″姞杞界姸鎬佸睍绀哄唴瀹? |
| `#footer`  | -      | Slot   | 鑷畾涔夋皵娉″簳閮ㄥ唴瀹?             |

## 鍔熻兘鐗规€?

1. **鏅鸿兘婊氬姩** - 鑷姩璺熻釜鏈€鏂版秷鎭綅缃?2. **娣卞害瀹氬埗** - 瀹屾暣鐨勬皵娉＄粍浠舵彃妲介€忎紶
2. **澶氱婊氬姩鏂瑰紡** - 婊氬姩鍒伴《閮ㄣ€佸簳閮ㄣ€佹寚瀹氫綅缃?4. **澶氱鏍峰紡** - 鏀寔澶氱鏍峰紡锛屽鍦嗗舰銆佹柟褰㈢瓑
