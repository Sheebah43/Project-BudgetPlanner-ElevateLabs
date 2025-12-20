<script setup>
import { ref } from "vue";
import { db } from "../firebase.js";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const props = defineProps({ userId: String });
const amount = ref("");
const source = ref("");
const date = ref("");
const error = ref("");

const addIncome = async () => {
  error.value = "";
  if (!props.userId) { error.value = "Login required."; return; }
  if (!amount.value || !date.value) { error.value = "Amount and date are required."; return; }
  if (Number(amount.value) < 0) { error.value = "Amount must be non-negative."; return; }

  const base = doc(db, "users", props.userId);
  await addDoc(collection(base, "incomes"), {
    amount: Number(amount.value),
    source: source.value || "Other",
    date: new Date(date.value),
    createdAt: serverTimestamp()
  });

  amount.value = ""; source.value = ""; date.value = "";
};
</script>

<template>
  <div class="card">
    <h3>Add income</h3>
    <input v-model="amount" type="number" min="0" placeholder="Amount" />
    <input v-model="source" placeholder="Source" />
    <input v-model="date" type="date" />
    <div class="filters" style="justify-content: space-between">
      <button @click="addIncome">Add</button>
      <span class="badge" v-if="error">{{ error }}</span>
    </div>
  </div>
</template>
