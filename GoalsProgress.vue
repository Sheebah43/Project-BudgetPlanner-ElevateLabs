<script setup>
import { computed } from "vue";

const props = defineProps({ goals: Array });
const withProgress = computed(() => (props.goals || []).map(g => {
  const target = Number(g.targetAmount) || 0;
  const current = Number(g.currentAmount) || 0;
  const pct = target > 0 ? Math.min(100, Math.round(100 * (current / target))) : 0;
  return { ...g, pct, target, current };
}));
</script>

<template>
  <div class="card">
    <h3>Savings goals</h3>
    <div v-if="withProgress.length === 0" class="badge">No goals yet.</div>
    <div v-for="g in withProgress" :key="g.id" class="goal">
      <div class="head">
        <strong>{{ g.name }}</strong>
        <span>{{ g.current }} / {{ g.target }} ({{ g.pct }}%)</span>
      </div>
      <div class="bar">
        <div class="fill" :style="{ width: g.pct + '%' }"></div>
      </div>
    </div>
  </div>
</template>
