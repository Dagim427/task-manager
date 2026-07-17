import "./register.css";

function LeftPanel() {
  return (
    <>
      {/* <!-- LEFT PANEL --> */}
      <div class="left-panel">
        <div class="bg-grid"></div>
        <div class="bg-glow"></div>

        <div class="panel-content">
          {/* <!-- Logo --> */}
          <div class="logo">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="rgba(255,255,255,0.2)"
              stroke="white"
              stroke-width="2"
            >
              <rect width="20" height="20" x="2" y="2" rx="6"></rect>
              <path
                d="M7 12l3 3 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            TaskFlow
          </div>

          {/* <!-- Hero Section --> */}
          <div class="hero-text">
            <h1>
              Start your journey
              <br />
              to peak productivity.
            </h1>
            <p>
              Join thousands of professionals who manage their work with clarity
              and focus.
            </p>

            <ul class="benefits-list">
              <li>
                <div class="benefit-icon">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--success-color)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Unlimited tasks & projects
              </li>
              <li>
                <div class="benefit-icon">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--success-color)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Smart priority management
              </li>
              <li>
                <div class="benefit-icon">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--success-color)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Team collaboration tools
              </li>
              <li>
                <div class="benefit-icon">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--success-color)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Advanced analytics dashboard
              </li>
            </ul>
          </div>

          {/* <!-- Testimonial --> */}
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="avatar">SR</div>
              <div class="author-info">
                <span class="author-name">Sarah Rodriguez</span>
                <span class="author-role">Product Manager at Stripe</span>
              </div>
            </div>
            <p class="quote">
              "TaskFlow transformed how our team works. We ship 30% faster now."
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel;
