<script setup>
import { ref } from "vue";
import { db } from "../firebase.js";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const props = defineProps({ userId: String });
const amount = ref("");
const category = ref("Food");
const date = ref("");
const notes = ref("");
const error = ref("");

const addExpense = async () => {
  error.value = "";
  if (!props.userId) { error.value = "Login required."; return; }
  if (!amount.value || !date.value) { error.value = "Amount and date are required."; return; }
  if (Number(amount.value) < 0) { error.value = "Amount must be non-negative."; return; }

  const base = doc(db, "users", props.userId);
  await addDoc(collection(base, "expenses"), {
    amount: Number(amount.value),
    category: category.value,
    date: new Date(date.value),
    notes: notes.value,
    createdAt: serverTimestamp()
  });

  amount.value = ""; date.value = ""; notes.value = ""; category.value = "Food";
};
</script>

<template>
  <div class="card">
    <h3>Add expense</h3>
    <input v-model="amount" type="number" min="0" placeholder="Amount" />
    <select v-model="category">
      <option>Food</option>
      <option>Rent</option>
      <option>Transport</option>
      <option>Utilities</option>
      <option>Other</option>
    </select>
    <input v-model="date" type="date" />
    <input v-model="notes" placeholder="Notes (optional)" />
    <div class="filters" style="justify-content: space-between">
      <button @click="addExpense">Add</button>
      <span class="badge" v-if="error">{{ error }}</span>
    </div>
  </div>
</template>
