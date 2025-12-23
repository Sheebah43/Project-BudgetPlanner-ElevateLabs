<script setup>
import { onMounted, watch, ref } from "vue";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";

// Register Chart.js components once
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// Props: arrays of expense and income objects
const props = defineProps({
  expenses: { type: Array, default: () => [] },
  incomes: { type: Array, default: () => [] }
});

const canvas = ref(null);
let chartInstance = null;

// Helper: group items by YYYY-MM
function groupByMonth(items) {
  const map = new Map();
  items.forEach(i => {
    const d = i.date?.toDate ? i.date.toDate() : new Date(i.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) || 0) + (Number(i.amount) || 0));
  });
  return map;
}

// Render chart
function renderChart() {
  const expMap = groupByMonth(props.expenses);
  const incMap = groupByMonth(props.incomes);
  const months = Array.from(new Set([...expMap.keys(), ...incMap.keys()])).sort();

  const expData = months.map(m => expMap.get(m) || 0);
  const incData = months.map(m => incMap.get(m) || 0);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(canvas.value, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "Expenses", data: expData, backgroundColor: "#e15759" },
        { label: "Income", data: incData, backgroundColor: "#59a14f" }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Monthly Totals"
        }
      },
      scales: {
        x: { title: { display: true, text: "Month" } },
        y: { title: { display: true, text: "Amount" }, beginAtZero: true }
      }
    }
  });
}

// Lifecycle
onMounted(renderChart);
watch(() => [props.expenses, props.incomes], renderChart, { deep: true });
</script>

<template>
  <div class="card chart-card">
    <h3>Monthly Totals</h3>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.chart-card {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
</style>
