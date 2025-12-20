<script setup>
import { ref } from "vue";
import { auth, provider } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
thePassword:
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (e) { error.value = e.message; }
};

const register = async () => {
  error.value = "";
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (e) { error.value = e.message; }
};

const loginGoogle = async () => {
  error.value = "";
  try {
    await signInWithPopup(auth, provider);
    router.push("/");
  } catch (e) { error.value = e.message; }
};
</script>

<template>
  <div class="auth">
    <h2>Budget Planner Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
    <button class="secondary" @click="register">Register</button>
    <button @click="loginGoogle">Sign in with Google</button>
    <p v-if="error" class="badge">{{ error }}</p>
  </div>
</template>
