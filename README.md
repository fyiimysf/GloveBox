# GloveBox

**GloveBox** is a modern, sleek URL stashing and bookmarking web app that combines aesthetics with functionality. With a **glassmorphism-inspired UI**, it allows users to easily store, manage, and access their favorite URLs. The app fetches **Open Graph meta tags** to display rich, useful previews for each link.

GloveBox is built with **SvelteKit** for a reactive, fast interface, and **Tailwind CSS** for clean, modern styling. It also includes a **custom OpenGraph API** for automatic metadata fetching. Best of all, GloveBox is fully hosted and provides an **easy-to-use, private, and secure bookmarking experience** with **local data storage** and **backup options**.

_Example of GloveBox’s modern glassmorphic UI_
![screenshot-placeholder](https://github.com/fyiimysf/GloveBox/blob/main/static/screenshots/GloveBox_ss.png)

---

## ✨ Features

- 🔖 **Smart Bookmarking** – Save URLs with OpenGraph meta tags for enhanced usability
- 💎 **Modern Glassmorphism UI** – Beautiful, minimal design using Tailwind CSS
- ⚡ **Powered by SvelteKit** – Fast and reactive web app
- 🌐 **Custom OpenGraph API** – Built-in API for fetching OpenGraph metadata
- 🔒 **Private & Secure** – All data is stored locally on your device, ensuring privacy
- 🗂️ **Backup Data** – Easily back up your data for safekeeping or transferring across devices
- ☁️ **Hosted App** – Live and available for use

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/fyiimysf/GloveBox.git
cd GloveBox

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

---

## 🌍 Live Demo

> 🔗 [GloveBox Web App](https://glovebox.appmy.workers.dev)

---

## 🔒 Privacy & Data Backup

GloveBox prioritizes privacy and ensures that all of your URL data is **stored locally** on your device. Your bookmarks, OpenGraph metadata, and other user data are never shared with external servers unless explicitly backed up or synced by the user.

### Backup Data

You can easily back up your data at any time to ensure it's safe and accessible. Export your data to a secure file format that can be stored offline or moved to another device.

---

## 📦 Project Structure

```
src/
├── routes/           # SvelteKit routes
├───────── api/       # Shared utilities and OpenGraph API
├── lib/components/   # UI Components and Image Assets
├── static/           # Static Assets and Manifest
```

---

## 🛠️ Technologies Used

- [SvelteKit](https://kit.svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- OpenGraph Meta Tag Parsing
- Custom API integration
- Deployed on \[CloudFlare]

---

## 🤝 Contributing

Contributions are always welcome! If you want to improve the app or add new features, feel free to open an issue or a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## 📄 License

MIT License – see [LICENSE](./LICENSE) for more details.

---

## 📬 Contact

For questions or feedback:

- GitHub: [@fyiimysf](https://github.com/fyiimysf)
