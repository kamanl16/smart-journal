<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

// STATE: Variables to store data
const user = ref(null)
const journalText = ref('')
const moodResult = ref('')
const isLoading = ref(false)

// CHECK IF LOGGED IN
onMounted(async () => {
  // Check active session
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user || null

  // Listen for login/logout changes
  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user || null
  })
})

// LOGIN FUNCTION
const login = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}

// LOGOUT FUNCTION
const logout = async () => {
  await supabase.auth.signOut()
}

// FUNCTION: Send data to your backend
const analyzeEntry = async () => {
  if (!journalText.value) return

  isLoading.value = true
  moodResult.value = '' // Reset previous result

  try {
    const response = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: journalText.value,
        userId: user.value.id
      })
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
    <div v-if="!user" class="login-box">
      <h1>🔒 Smart Journal</h1>
      <p>Please log in to analyze your day.</p>
      <button @click="login" class="google-btn">Login with Google</button>
    </div>

    <div v-else>
      <header>
        <span>Welcome, {{ user.email }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </header>

    <h1>📓 Your Daily Entry</h1>
      <textarea v-model="journalText" rows="5"></textarea>
      <button @click="analyzeEntry" :disabled="isLoading">
        {{ isLoading ? 'Analyzing...' : 'Save & Analyze' }}
      </button>

      <div v-if="moodResult" class="result">
        <h3>Mood: {{ moodResult }}</h3>
      </div>
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
.google-btn {
  background: #4285F4;
  color: white; padding:
  10px 20px;
  border: none; 
  border-radius: 4px; 
  cursor:   pointer; 
  font-size: 1.1rem;
}
.logout-btn { 
  background: #ff4d4d; 
  color: white; 
  border: none; 
  padding: 5px 10px; 
  cursor: pointer; 
  margin-left: 10px; 
}
header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 2rem; 
  padding-bottom: 1rem; 
  border-bottom: 1px solid #ddd; 
}
textarea { 
  width: 100%; 
  padding: 1rem; 
  margin-bottom: 1rem; 
}
</style>