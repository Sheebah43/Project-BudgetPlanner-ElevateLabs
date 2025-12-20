<script setup>
import { onMounted, watch, ref } from "vue";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({ expenses: Array, incomes: Array });
const canvas = ref(null);
let chart;

function groupByMonth(items) {
  const map = new Map();
  items.forEach(i => {
    const d = i.date?.toDate ? i.date.toDate() : new Date(i.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    map.set(key, (map.get(key) || 0) + (Number(i.amount) || 0));
  });
  return map;
}

function render() {
  const expMap = groupByMonth(props.expenses || []);
  const incMap = groupByMonth(props.incomes || []);
  const months = Array.from(new Set([ ...expMap.keys(), ...incMap.keys() ])).sort();

  const expData = months.map(m => expMap.get(m) || 0);
  const incData = months.map(m => incMap.get(m) || 0);

  if (chart) chart.destroy();
  chart = new Chart(canvas.value, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "Expenses", data: expData, backgroundColor: "#e15759" },
        { label: "Income", data: incData, backgroundColor: "#59a14f" }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });
}

onMounted(render);
watch(() => [props.expenses, props.incomes], render, { deep: true });
</script>

<template>
  <div class="card chart-card">
    <h3>Monthly totals</h3>
    <canvas ref="canvas"></canvas>
  </div>
</template>
