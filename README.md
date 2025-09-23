# TYSONCLOUD

**TYSONCLOUD** is a cloud deployment platform designed to make application hosting simple, affordable, and accessible. This repository contains the frontend portion of TYSONCLOUD, built with [Svelte](https://svelte.dev/), powering the user interface at [tysoncloud.tysonjenkins.dev](https://tysoncloud.tysonjenkins.dev). With a focus on ease of use, TYSONCLOUD enables users to deploy applications by providing a Docker image or GitHub repository link, streamlining the process through an intuitive web interface.

## Features
- **User Authentication**: Secure sign-in functionality to access the TYSONCLOUD dashboard.
- **Simple Deployment**: Deploy applications effortlessly by entering a Docker image name or a GitHub repository URL.
- **Intuitive UI**: Clean, responsive interface built with Svelte for a seamless user experience.
- **Scalable Foundation**: Designed to integrate with TYSONCLOUD’s backend for automated container management and cloud hosting.

## Getting Started

Follow these steps to set up and run the TYSONCLOUD frontend locally.

### Prerequisites
- Bun
- [npm](https://www.npmjs.com/) (v8 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/timmyjinks/TYSONCLOUD-frontend.git
   cd TYSONCLOUD-frontend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```

### Running Locally
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser to `http://localhost:5173` to view the TYSONCLOUD frontend.

## Usage
1. **Sign In**:
   - Visit [tysoncloud.tysonjenkins.dev](https://tysoncloud.tysonjenkins.dev) or your local instance.
   - Log in with your credentials (or create an account if supported).
2. **Deploy an Application**:
   - Navigate to the deployment section in the dashboard.
   - Enter a Docker image (e.g., `nginx:latest`) or a GitHub repository URL (e.g., `https://github.com/username/repo`).
   - Follow the prompts to configure and deploy your application.
3. **Monitor Deployments**:
   - View active deployments and manage containers through the intuitive UI.q

## Tech Stack
- **Frontend**: [Svelte](https://svelte.dev/) for reactive, component-based UI development.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive, utility-first design.
- **Deployment**: Hosted on [Cloudflare Pages](https://pages.cloudflare.com/) for fast, secure access.

## License
This project is licensed under the [MIT License](LICENSE).

For issues or feature requests, please open an [Issue](https://github.com/timmyjinks/TYSONCLOUD-frontend/issues) on GitHub.
