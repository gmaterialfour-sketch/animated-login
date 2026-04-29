<!doctype html>
<html lang="${(locale.currentLanguageTag)!'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${realm.displayName!realm.name} Log-In</title>
  <link rel="stylesheet" href="${url.resourcesPath}/assets/css/modern-effects.css">
</head>
<body>
  <main class="pmo-login">
    <div class="loading-overlay" aria-hidden="true">
      <div class="loader-mark"></div>
    </div>
    <video class="background-video" autoplay muted loop playsinline preload="metadata" poster="${url.resourcesPath}/assets/images/login-reference.png">
      <source src="${url.resourcesPath}/assets/animations/login-background.mp4" type="video/mp4">
    </video>
    <div class="background-poster" aria-hidden="true"></div>
    <canvas id="pmo-3d-scene" class="three-scene" aria-hidden="true"></canvas>
    <div class="background-shade" aria-hidden="true"></div>

    <header class="brand-bar" aria-label="Brand">
      <img class="jakson-logo" src="${url.resourcesPath}/assets/images/logos/jkg-w.png" alt="Jakson Green">
      <img class="energix-logo" src="${url.resourcesPath}/assets/images/logos/energxiq-w.png" alt="energxIQ">
    </header>

    <section class="intro-panel" aria-label="PMO Master Access">
      <div class="access-title">
        <span class="access-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" focusable="false">
            <path d="M16 5.5a3.7 3.7 0 1 1 0 7.4 3.7 3.7 0 0 1 0-7.4Zm0 3a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4ZM15 14h2v3.4l5.3 10.2-2.7 1.4-3.6-7-3.6 7-2.7-1.4L15 17.4V14Z"/>
          </svg>
        </span>
        <span>PMO MASTER ACCESS</span>
      </div>
      <h1>Precision in<br>Project Management.</h1>
      <p>Access the central hub for Daily Progress Reports, procurement tracking, and cross-functional commissioning for Phase II Infrastructure developments.</p>
    </section>

    <section class="login-panel" aria-label="Log-In">
      <div class="pmo-card">
        <div class="card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 3.2 18.6 6v5.2c0 4.2-2.8 7.7-6.6 9.2-3.8-1.5-6.6-5-6.6-9.2V6L12 3.2Zm-1 10.6 5-5-1.5-1.5L11 10.8 9.5 9.3 8 10.8l3 3Z"/>
          </svg>
        </div>
        <h2>Login</h2>
        <p class="login-subtitle">Hi, Welcome back</p>

        <#if message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
          <div class="alert alert-${message.type}" role="alert">
            <strong>Access check failed</strong>
            <span>Please check your username and password, then try again.</span>
          </div>
        </#if>

        <form id="kc-form-login" action="${url.loginAction}" method="post" novalidate>
          <#if usernameHidden?? && usernameHidden>
            <input id="username" name="username" type="hidden" value="${(login.username)!''}">
          <#else>
            <div class="field-group">
              <label for="username">Your user Name</label>
              <div class="input-shell">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-4.1 0-7.4 2.1-7.4 4.7v1.1h14.8V19c0-2.6-3.3-4.7-7.4-4.7Z"/>
                  </svg>
                </span>
                <input id="username" name="username" type="text" autocomplete="username" autofocus required aria-describedby="username-error" placeholder="employee@company.com" value="${(login.username)!''}">
              </div>
              <p id="username-error" class="field-error" aria-live="polite"></p>
            </div>
          </#if>

          <div class="field-group">
            <label for="password">Secure Password</label>
            <div class="input-shell">
              <span class="input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7 0V7a2 2 0 1 1 4 0v2h-4Zm3 7.7V18h-2v-1.3a2 2 0 1 1 2 0Z"/>
                </svg>
              </span>
              <input id="password" name="password" type="password" autocomplete="current-password" required aria-describedby="password-error" placeholder="••••••••">
              <button class="password-toggle" type="button" aria-label="Show password" aria-pressed="false">
                <svg class="eye-open" viewBox="0 0 24 24" focusable="false">
                  <path d="M12 5c5 0 8.7 4.2 10 7-1.3 2.8-5 7-10 7s-8.7-4.2-10-7c1.3-2.8 5-7 10-7Zm0 2C8.5 7 5.7 9.6 4.3 12c1.4 2.4 4.2 5 7.7 5s6.3-2.6 7.7-5C18.3 9.6 15.5 7 12 7Zm0 2.1a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Z"/>
                </svg>
                <svg class="eye-closed" viewBox="0 0 24 24" focusable="false">
                  <path d="m3.3 2 18.4 18.4-1.4 1.4-3.2-3.2A10.4 10.4 0 0 1 12 20c-5 0-8.7-4.2-10-8a14.8 14.8 0 0 1 4-5.1L1.9 3.4 3.3 2Zm6.1 8.1a2.9 2.9 0 0 0 3.6 3.6l-3.6-3.6ZM12 4c5 0 8.7 4.2 10 8a14.6 14.6 0 0 1-3 4.2l-2.2-2.2A5 5 0 0 0 10 7.2L8.2 5.4C9.3 4.5 10.6 4 12 4Z"/>
                </svg>
              </button>
            </div>
            <p id="password-error" class="field-error" aria-live="polite"></p>
          </div>



          <div class="form-row">
            <label class="remember-option" for="rememberMe"></label>
            <#if realm.resetPasswordAllowed>
              <a href="${url.loginResetCredentialsUrl}">Forgot Password?</a>
            <#else>
              <span class="forgot-disabled">Forgot Password?</span>
            </#if>
          </div>

          <#if (auth.selectedCredential)?has_content>
            <input type="hidden" name="credentialId" value="${auth.selectedCredential}">
          </#if>

          <button type="submit">Log in</button>
        </form>

        <div class="security-note" aria-label="Secure area">
          <span></span>
          <strong>Secure Area</strong>
          <span></span>
        </div>
      </div>
    </section>
  </main>
  <script type="module" src="${url.resourcesPath}/assets/js/modern-animations.js"></script>
</body>
</html>
