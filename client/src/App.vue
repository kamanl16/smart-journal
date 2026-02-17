<script setup>
import { ref } from 'vue'

// 1. STATE: Variables to store data
const journalText = ref('')
const moodResult = ref('')
const isLoading = ref(false)

// 2. FUNCTION: Send data to your backend
const analyzeEntry = async () => {
  if (!journalText.value) return

  isLoading.value = true
  moodResult.value = '' // Reset previous result

  try {
    const response = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: journalText.value })
    })

    const data = await response.json()
    moodResult.value = data.analysis // "Positive", "Negative", etc.
  } catch (error) {
    console.error("Error:", error)
    moodResult.value = "Error connecting to server."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1>📓 Smart Journal</h1>

    <textarea 
      v-model="journalText" 
      placeholder="How was your day?..."
      rows="5"
    ></textarea>

    <button @click="analyzeEntry" :disabled="isLoading">
      {{ isLoading ? 'Analyzing...' : 'Save & Analyze' }}
    </button>

    <div v-if="moodResult" class="result">
      <h3>AI Analysis:</h3>
      <p class="mood">{{ moodResult }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Simple CSS to make it look decent */
.container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
  font-family: sans-serif;
}
textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  font-size: 1rem;
}
button {
  background-color: #42b883; /* Vue Green */
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
}
.result {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f4f4f4;
  border-radius: 8px;
}
.mood {
  font-size: 1.5rem;
  font-weight: bold;
  color: #35495e;
}
</style>