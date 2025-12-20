<script setup>
import { ref } from "vue";
import { db } from "../firebase.js";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const props = defineProps({ userId: String });
const name = ref("");
const targetAmount = ref("");
const currentAmount = ref("");
const deadline = ref("");
const error = ref("");

const addGoal = async () => {
  error.value = "";
  if (!props.userId) { error.value = "Login required."; return; }
  if (!name.value || !targetAmount.value) { error.value = "Name and target are required."; return; }

  const base = doc(db, "users", props.userId);
  await addDoc(collection(base, "goals"), {
    name: name.value,
    targetAmount: Number(targetAmount.value),
    currentAmount: Number(currentAmount.value || 0),
    deadline: deadline.value ? new Date(deadline.value) : null,
    createdAt: serverTimestamp()
  });

  name.value = ""; targetAmount.value = ""; currentAmount.value = ""; deadline.value = "";
};
</script>

<template>
  <div class="card">
    <h3>Add goal</h3>
    <input v-model="name" placeholder="Goal name" />
    <input v-model="targetAmount" type="number" min="1" placeholder="Target amount" />
    <input v-model="currentAmount" type="number" min="0" placeholder="Current amount" />
    <input v-model="deadline" type="date" />
    <div class="filters" style="justify-content: space-between">
      <button @click="addGoal">Add</button>
      <span class="badge" v-if="error">{{ error }}</span>
    </div>
  </div>
</template>
