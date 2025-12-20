<script setup>
import { ref, computed } from "vue";
import { auth, db } from "../firebase.js";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc
} from "firebase/firestore";

import IncomesForm from "../components/IncomesForm.vue";
import ExpensesForm from "../components/ExpensesForm.vue";
import GoalsForm from "../components/GoalsForm.vue";
import PieByCategory from "../components/PieByCategory.vue";
import BarMonthlyTotals from "../components/BarMonthlyTotals.vue";
import GoalsProgress from "../components/GoalsProgress.vue";

const userId = ref(null);
const month = ref(new Date());
const categoryFilter = ref("All");

const expenses = ref([]);
const incomes = ref([]);
const goals = ref([]);

onAuthStateChanged(auth, (user) => {
  userId.value = user?.uid || null;
  if (userId.value) subscribeData();
});

function subscribeData() {
  const base = doc(db, "users", userId.value);

  onSnapshot(query(collection(base, "expenses"), orderBy("date", "desc")), (snap) => {
    expenses.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  });

  onSnapshot(query(collection(base, "incomes"), orderBy("date", "desc")), (snap) => {
    incomes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  });

  onSnapshot(query(collection(base, "goals"), orderBy("createdAt", "desc")), (snap) => {
    goals.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  });
}

const filteredExpenses = computed(() => {
  const m = month.value.getMonth();
  const y = month.value.getFullYear();
  return expenses.value.filter(e => {
    const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
    const byMonth = d.getMonth() === m && d.getFullYear() === y;
    const byCat = categoryFilter.value === "All" || e.category === categoryFilter.value;
    return byMonth && byCat;
  });
});

const filteredIncomes = computed(() => {
  const m = month.value.getMonth();
  const y = month.value.getFullYear();
  return incomes.value.filter(i => {
    const d = i.date?.toDate ? i.date.toDate() : new Date(i.date);
    return d.getMonth() === m && d.getFullYear() === y;
  });
});

const totalIncome = computed(() => filteredIncomes.value.reduce((s, i) => s + (Number(i.amount) || 0), 0));
const totalExpense = computed(() => filteredExpenses.value.reduce((s, e) => s + (Number(e.amount) || 0), 0));
const net = computed(() => totalIncome.value - totalExpense.value);

const logout = async () => { await signOut(auth); };

const updateMonth = (val) => {
  month.value = new Date(val + "-01");
};
</script>

<template>
  <div>
    <header class="header">
      <h1>Budget Planner</h1>
      <div class="summary">
        <div class="pill"><strong>Total income:</strong> {{ totalIncome.toFixed(2) }}</div>
        <div class="pill"><strong>Total expenses:</strong> {{ totalExpense.toFixed(2) }}</div>
        <div class="pill"><strong>Net:</strong> {{ net.toFixed(2) }}</div>
      </div>
      <div class="filters">
        <input type="month" @change="e => updateMonth(e.target.value)" />
        <select v-model="categoryFilter">
          <option>All</option>
          <option>Food</option>
          <option>Rent</option>
          <option>Transport</option>
          <option>Utilities</option>
          <option>Other</option>
        </select>
        <button class="secondary" @click="logout">Logout</button>
      </div>
    </header>

    <div class="separator"></div>

    <section class="grid-3">
      <IncomesForm :userId="userId" />
      <ExpensesForm :userId="userId" />
      <GoalsForm :userId="userId" />
    </section>

    <section class="grid-3" style="margin-top: 20px">
      <PieByCategory :expenses="filteredExpenses" />
      <BarMonthlyTotals :expenses="expenses" :incomes="incomes" />
      <GoalsProgress :goals="goals" />
    </section>
  </div>
</template>
