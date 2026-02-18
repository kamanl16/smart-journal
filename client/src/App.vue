<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

// STATE: Variables to store data
const user = ref(null)
const journalText = ref('')
const moodResult = ref('')
const isLoading = ref(false)
const history = ref([])

// CHECK IF LOGGED IN
onMounted(async () => {
  // Check active session
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user || null
  
  if (user.value) {
    fetchHistory() // Load history immediately if logged in
  }

  // Listen for login/logout changes
  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user || null
    if (user.value) {
      fetchHistory() // Fetch history on login
    } else {
      history.value = [] // Clear history on logout
    }
  })
})

// Function to Fetch History
const fetchHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false }) // Newest on top

    if (error) throw error
    history.value = data
  } catch (error) {
    console.error("Error fetching history:", error.message)
  }
}

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

    // Clear the textarea after submission
    journalText.value = ''
    // Refresh history to show the new entry
    fetchHistory()

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

      <h1>What's on your mind?</h1>


      <div class="input-section">
        <textarea 
          v-model="journalText" 
          placeholder="Today was..." 
          rows="4"
        ></textarea>
        
        <div class="controls">
          <button @click="analyzeEntry" :disabled="isLoading" class="save-btn">
            {{ isLoading ? 'Analyzing...' : 'Save Entry' }}
          </button>
          <span v-if="moodResult" class="current-mood">
            Current Mood: <strong>{{ moodResult }}</strong>
          </span>
        </div>
        
        <div v-if="history.length > 0" class="history-list">
        <h2>Past Entries</h2>
        <div v-for="entry in history" :key="entry.id" class="card">
          <div class="card-header">
            <span :class="['tag', entry.mood]">{{ entry.mood }}</span>
            <span class="date">{{ new Date(entry.created_at).toLocaleDateString() }}</span>
          </div>
          <p class="card-text">{{ entry.content }}</p>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout */
.container { max-width: 600px; margin: 0 auto; padding: 2rem; font-family: 'Segoe UI', sans-serif; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.user-email { font-weight: bold; color: #555; }

/* Buttons */
.google-btn { background: #4285F4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.logout-btn { background: transparent; border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
.save-btn { background: #42b883; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.save-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* Input */
textarea { width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid #ddd; font-family: inherit; margin-bottom: 1rem; resize: vertical; }
.controls { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.current-mood { color: #555; }

/* History Cards */
.history-list h2 { border-bottom: 2px solid #eee; padding-bottom: 0.5rem; margin-bottom: 1rem; font-size: 1.2rem; }
.card { background: #fff; border: 1px solid #eee; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: left; }
.card-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.date { font-size: 0.85rem; color: #999; }
.card-text { color: #333; line-height: 1.5; margin: 0; }

/* Mood Tags */
.tag { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
.tag.Positive { background: #d4edda; color: #155724; }
.tag.Negative { background: #f8d7da; color: #721c24; }
.tag.Neutral { background: #fff3cd; color: #856404; }
</style>