<docs>
---
title: 搭配 BubbleList 使用粘性代码头部
---

将 `MarkdownRenderer` 放在 `BubbleList` 的 `#content` 插槽中，以 BubbleList 自身作为滚动容器。滚动列表时，代码块顶部的语言标签与操作栏会吸附到 **BubbleList 可视区域顶部**，而非页面顶部，不受文档导航栏遮挡。
</docs>

<script setup lang="ts">
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

interface MessageItem {
  key: number;
  placement: 'start' | 'end';
  content: string;
  avatar: string;
}

const messages: MessageItem[] = [
  {
    key: 1,
    placement: 'end',
    avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
    content: '请给我写一段完整的 TypeScript 用户管理模块示例。'
  },
  {
    key: 2,
    placement: 'start',
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    content: `好的，下面是一个完整的 TypeScript 用户管理模块示例：

\`\`\`typescript
// user.ts — 用户管理模块

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
}

const store = new Map<number, User>();
let nextId = 1;

export function createUser(dto: CreateUserDTO): User {
  const now = new Date();
  const user: User = {
    id: nextId++,
    name: dto.name,
    email: dto.email,
    role: dto.role ?? 'viewer',
    createdAt: now,
    updatedAt: now,
  };
  store.set(user.id, user);
  return user;
}

export function getUserById(id: number): User | undefined {
  return store.get(id);
}

export function updateUser(id: number, dto: UpdateUserDTO): User {
  const user = store.get(id);
  if (!user) throw new Error(\`User \${id} not found\`);
  Object.assign(user, dto, { updatedAt: new Date() });
  return user;
}

export function deleteUser(id: number): boolean {
  return store.delete(id);
}

export function listUsers(role?: UserRole): User[] {
  const all = Array.from(store.values());
  return role ? all.filter(u => u.role === role) : all;
}

// 使用示例
const alice = createUser({ name: 'Alice', email: 'alice@example.com', role: 'admin' });
const bob   = createUser({ name: 'Bob',   email: 'bob@example.com' });

console.log(listUsers());          // [alice, bob]
console.log(listUsers('admin'));   // [alice]

updateUser(bob.id, { role: 'editor' });
console.log(getUserById(bob.id));  // { ...bob, role: 'editor' }

deleteUser(alice.id);
console.log(listUsers());          // [bob]
\`\`\`

以上代码包含：类型定义、CRUD 操作、简单内存存储，可按需替换为数据库实现。`
  },
  {
    key: 3,
    placement: 'end',
    avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
    content: '再来一个 Vue 3 组合式 API 的计数器组件示例。'
  },
  {
    key: 4,
    placement: 'start',
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    content: `当然，这是一个使用 Vue 3 组合式 API 的计数器组件：

\`\`\`vue
<!-- Counter.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
});

const emit = defineEmits<{
  change: [value: number];
}>();

const count = ref(props.min);

const canDecrement = computed(() => count.value - props.step >= props.min);
const canIncrement = computed(() => count.value + props.step <= props.max);

function decrement() {
  if (canDecrement.value) {
    count.value -= props.step;
    emit('change', count.value);
  }
}

function increment() {
  if (canIncrement.value) {
    count.value += props.step;
    emit('change', count.value);
  }
}

function reset() {
  count.value = props.min;
  emit('change', count.value);
}
<\/script>

<template>
  <div class="counter">
    <button :disabled="!canDecrement" @click="decrement">－</button>
    <span class="value">{{ count }}</span>
    <button :disabled="!canIncrement" @click="increment">＋</button>
    <button class="reset" @click="reset">重置</button>
  </div>
</template>

<style scoped>
.counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.value {
  min-width: 3ch;
  text-align: center;
  font-size: 1.2em;
  font-weight: 600;
}
button {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: pointer;
}
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.reset {
  font-size: 0.85em;
  color: #666;
}
</style>
\`\`\`

该组件支持 \`min\`、\`max\`、\`step\` 属性，并通过 \`change\` 事件向父组件传递最新值。`
  }
];

const rendererProps = computed(() => ({
  showCodeBlockHeader: true,
  stickyCodeBlockHeader: true,
  enableCodeLineNumber: true
}));
</script>

<template>
  <div class="bubble-sticky-demo">
    <div class="hint">
      💡 向下滚动列表，代码块顶部的语言标签将吸附到
      <strong>BubbleList 可视区顶部</strong>，而非页面顶部。
    </div>
    <div class="list-stage">
      <BubbleList :list="messages">
        <template #content="{ item }">
          <component
            :is="MarkdownRenderer"
            v-if="item.placement === 'start' && MarkdownRenderer"
            :markdown="item.content"
            v-bind="rendererProps"
          />
          <span v-else>{{ item.content }}</span>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bubble-sticky-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .hint {
    padding: 10px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ecf5ff 0%, #f0f9eb 100%);
    border: 1px solid #d9ecff;
    font-size: 13px;
    color: #409eff;

    strong {
      color: #67c23a;
    }
  }

  .list-stage {
    height: 460px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    padding: 8px 10px;
  }
}
</style>
