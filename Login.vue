<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model.trim="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleLogin() {
  error.value = "";
  if (!email.value || !password.value) {
    error.value = "Please enter both email and password.";
    return;
  }

  loading.value = true;
  try {
    // Placeholder login logic — replace with Firebase auth or API call
    console.log("Logging in with:", email.value, password.value);

    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form after success
    email.value = "";
    password.value = "";
  } catch (e) {
    error.value = "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

h1 {
  margin-bottom: 1rem;
  text-align: center;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #2c3e50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #34495e;
}

.error {
  margin-top: 1rem;
  color: red;
  text-align: center;
}
</style>
