import "./login.css"

function LeftPanel() {
  return (
    <>
      <div class="left-panel">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>

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

          {/* <!-- Center Mockup UI --> */}
          <div class="mockup-area">
            {/* <!-- Task 1 --> */}
            <div class="glass-card card-1">
              <div class="task-header">
                <div class="task-title">
                  <span class="dot dot-green"></span>
                  Design system update
                </div>
                <span class="badge badge-done">Done</span>
              </div>
              <div class="progress-line">
                <div class="progress-fill fill-green"></div>
              </div>
            </div>

            {/* <!-- Task 2 --> */}
            <div class="glass-card card-2">
              <div class="task-header">
                <div class="task-title">
                  <span class="dot dot-yellow"></span>
                  API Integration
                </div>
                <span class="badge badge-progress">In Progress</span>
              </div>
              <div class="progress-line">
                <div class="progress-fill fill-yellow"></div>
              </div>
            </div>

            {/* <!-- Task 3 --> */}
            <div class="glass-card card-3">
              <div class="task-header">
                <div class="task-title">
                  <span class="dot dot-red"></span>
                  Deploy to production
                </div>
                <span class="badge badge-high">High</span>
              </div>
              <div class="progress-line">
                <div class="progress-fill fill-red"></div>
              </div>
            </div>

            {/* <!-- Stats --> */}
            <div class="stats-container">
              <div class="glass-card stat-box">
                <div class="stat-num">48</div>
                <div class="stat-label">Tasks Done</div>
              </div>
              <div class="glass-card stat-box">
                <div class="stat-num">12</div>
                <div class="stat-label">In Progress</div>
              </div>
              <div class="glass-card stat-box">
                <div class="stat-num">8</div>
                <div class="stat-label">Team Members</div>
              </div>
            </div>
          </div>

          {/* <!-- Footer Text --> */}
          <div class="hero-text">
            <div class="trusted-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              Trusted by 10,000+ professionals
            </div>
            <h1>
              Organize work,
              <br />
              achieve more.
            </h1>
            <p>
              TaskFlow helps teams move faster with clear priorities and
              beautiful workflows.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeftPanel