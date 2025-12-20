<script setup>
import { onMounted, watch, ref } from "vue";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const props = defineProps({ expenses: Array });
const canvas = ref(null);
let chart;

function buildData() {
  const totals = {};
  (props.expenses || []).forEach(e => {
    const cat = e.category || "Other";
    totals[cat] = (totals[cat] || 0) + (Number(e.amount) || 0);
  });
  const labels = Object.keys(totals);
  const data = Object.values(totals);
  return { labels, data };
}

function render() {
  const { labels, data } = buildData();
  if (chart) chart.destroy();
  chart = new Chart(canvas.value, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc949"]
      }]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });
}

onMounted(render);
watch(() => props.expenses, render, { deep: true });
</script>

<template>
  <div class="card chart-card">
    <h3>Expenses by category</h3>
    <canvas ref="canvas"></canvas>
  </div>
</template>
