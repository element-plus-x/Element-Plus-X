<docs>
---
title: Sticky Code Header with BubbleList
---

Place `MarkdownRenderer` inside BubbleList's `#content` slot so BubbleList acts as the scroll container. When the list is scrolled, the code block language label and action bar stick to the **top of BubbleList's visible area** — not the page viewport — so the document navbar never occludes it.
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
    content: 'Can you write a complete TypeScript user management module?'
  },
  {
    key: 2,
    placement: 'start',
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    content: `Sure! Here is a full TypeScript user management module:

\`\`\`typescript
// user.ts — User management module

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

// Usage
const alice = createUser({ name: 'Alice', email: 'alice@example.com', role: 'admin' });
const bob   = createUser({ name: 'Bob',   email: 'bob@example.com' });

console.log(listUsers());          // [alice, bob]
console.log(listUsers('admin'));   // [alice]

updateUser(bob.id, { role: 'editor' });
console.log(getUserById(bob.id));  // { ...bob, role: 'editor' }

deleteUser(alice.id);
console.log(listUsers());          // [bob]
\`\`\`

The module includes type definitions, CRUD operations and an in-memory store — swap the store for a database adapter as needed.`
  },
  {
    key: 3,
    placement: 'end',
    avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
    content: 'Now show me a Vue 3 Composition API counter component.'
  },
  {
    key: 4,
    placement: 'start',
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    content: `Here is a fully typed Vue 3 counter component using the Composition API:

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
    <button class="reset" @click="reset">Reset</button>
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

The component accepts \`min\`, \`max\` and \`step\` props and emits a \`change\` event with the new value.`
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
      💡 Scroll the list down — the code block header will stick to the
      <strong>top of the BubbleList viewport</strong>, not the page top.
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
