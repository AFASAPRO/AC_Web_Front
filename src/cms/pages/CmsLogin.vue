<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// If already authenticated, redirect to dashboard
onMounted(() => {
  if (auth.isAuthenticated) {
    router.replace('/cms/dashboard')
  }
})

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }

  isLoading.value = true

  const result = await auth.login(email.value, password.value, rememberMe.value)

  if (result.success) {
    router.push('/cms/dashboard')
  } else {
    errorMessage.value = result.message || 'Login failed. Please try again.'
  }

  isLoading.value = false
}
</script>

<template>
  <div class="cms-login">
    <!-- Left panel — Login form -->
    <div class="cms-login__form-panel">
      <div class="cms-login__form-wrapper">
        <!-- Logo / Brand -->
        <div class="cms-login__brand">
          <svg class="cms-login__logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8L14 4L14 16L6 20V8Z" fill="currentColor" />
            <path d="M18 12L26 8L26 20L18 24V12Z" fill="currentColor" />
          </svg>
        </div>

        <h1 class="cms-login__title">Sign In</h1>
        <p class="cms-login__subtitle">Continue to access your dashboard</p>

        <!-- Social buttons -->
        <button class="cms-login__social-btn" type="button" disabled>
          <svg class="cms-login__social-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <button class="cms-login__social-btn" type="button" disabled>
          <svg class="cms-login__social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.89C10.1 6.87 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
          </svg>
          Sign in with Apple
        </button>

        <!-- Divider -->
        <div class="cms-login__divider">
          <span class="cms-login__divider-line"></span>
          <span class="cms-login__divider-text">OR</span>
          <span class="cms-login__divider-line"></span>
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="cms-login__form">
          <!-- Error message -->
          <div v-if="errorMessage" class="cms-login__error">
            <svg class="cms-login__error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Email -->
          <div class="cms-login__field">
            <label class="cms-login__label" for="cms-email">Email</label>
            <input
              id="cms-email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="cms-login__input"
              autocomplete="email"
              required
            />
          </div>

          <!-- Password -->
          <div class="cms-login__field">
            <div class="cms-login__label-row">
              <label class="cms-login__label" for="cms-password">Password</label>
              <router-link to="/cms/forgot-password" class="cms-login__forgot-link">
                Forgot Password?
              </router-link>
            </div>
            <div class="cms-login__password-wrapper">
              <input
                id="cms-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="cms-login__input"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="cms-login__toggle-pw"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <svg v-if="!showPassword" class="cms-login__pw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round"/>
                </svg>
                <svg v-else class="cms-login__pw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember me -->
          <div class="cms-login__remember">
            <label class="cms-login__remember-label">
              <input type="checkbox" v-model="rememberMe" class="cms-login__checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="cms-login__submit"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="cms-login__spinner" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Footer -->
        <p class="cms-login__footer">
          Don't have an account?
          <span class="cms-login__create-link">Create an Account</span>
        </p>
      </div>
    </div>

    <!-- Right panel — Background image -->
    <div class="cms-login__image-panel">
      <img
        src="@/assets/images/Login-Bg.png"
        alt="Login background"
        class="cms-login__bg-image"
      />
    </div>
  </div>
</template>

<style scoped>
.cms-login {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: #ffffff;
}

/* ─── Left panel ─── */
.cms-login__form-panel {
  flex: 0 0 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
}

.cms-login__form-wrapper {
  width: 100%;
  max-width: 360px;
}

/* Brand / Logo */
.cms-login__brand {
  margin-bottom: 2rem;
}
.cms-login__logo-icon {
  width: 36px;
  height: 36px;
  color: #0a0a0a;
}

/* Title */
.cms-login__title {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a0a0a;
  letter-spacing: -0.02em;
  margin-bottom: 0.375rem;
}

.cms-login__subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.75rem;
}

/* Social buttons */
.cms-login__social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.6875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  color: #0a0a0a;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.625rem;
}
.cms-login__social-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}
.cms-login__social-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.cms-login__social-icon {
  width: 18px;
  height: 18px;
}

/* Divider */
.cms-login__divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
}
.cms-login__divider-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.cms-login__divider-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

/* Form */
.cms-login__form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.cms-login__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.cms-login__label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cms-login__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
}

.cms-login__forgot-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.cms-login__forgot-link:hover {
  color: #000;
}

.cms-login__input {
  width: 100%;
  padding: 0.6875rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #0a0a0a;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}
.cms-login__input::placeholder {
  color: #9ca3af;
}
.cms-login__input:focus {
  border-color: #0a0a0a;
  box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
}

/* Password wrapper */
.cms-login__password-wrapper {
  position: relative;
}
.cms-login__password-wrapper .cms-login__input {
  padding-right: 2.75rem;
}
.cms-login__toggle-pw {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.125rem;
  color: #6b7280;
}
.cms-login__toggle-pw:hover {
  color: #111827;
}
.cms-login__pw-icon {
  width: 18px;
  height: 18px;
}

/* Remember me */
.cms-login__remember {
  display: flex;
  align-items: center;
}
.cms-login__remember-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #4b5563;
  cursor: pointer;
}
.cms-login__checkbox {
  width: 16px;
  height: 16px;
  accent-color: #0a0a0a;
  border-radius: 3px;
  cursor: pointer;
}

/* Submit button */
.cms-login__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: #0a0a0a;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.25rem;
}
.cms-login__submit:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.cms-login__submit:active:not(:disabled) {
  transform: translateY(0);
}
.cms-login__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.cms-login__spinner {
  width: 18px;
  height: 18px;
  animation: spin 0.75s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.cms-login__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.8125rem;
  font-weight: 500;
}
.cms-login__error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Footer */
.cms-login__footer {
  text-align: center;
  margin-top: 1.75rem;
  font-size: 0.8125rem;
  color: #6b7280;
}
.cms-login__create-link {
  font-weight: 600;
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
.cms-login__create-link:hover {
  color: #000;
}

/* ─── Right panel ─── */
.cms-login__image-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
}
.cms-login__bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .cms-login {
    flex-direction: column;
  }
  .cms-login__form-panel {
    flex: 1;
    padding: 2rem 1.5rem;
  }
  .cms-login__image-panel {
    display: none;
  }
}
</style>
