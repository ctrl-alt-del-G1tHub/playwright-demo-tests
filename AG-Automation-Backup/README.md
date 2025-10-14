# Artisan Genius Automation

This repository contains **automated test scripts** for **Artisan Genius (AG)** using **Playwright** and **JavaScript**. It is intended to provide a structured, maintainable, and reusable framework for automating end-to-end tests for the Artisan Genius platform.

## ✅ Table of Contents

* [About](#about)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Running Tests](#running-tests)
* [Contributing](#contributing)
* [License](#license)

## 📝 About

The **Artisan Genius Automation** project is designed to automate the functional and UI testing of the **Artisan Genius platform**. The goal is to reduce manual testing effort, improve test coverage, and speed up release cycles, ensuring a more reliable product.

## 📘 Tech Stack

* **Test Framework:** Playwright
* **Language:** JavaScript
* **Test Runner:** Playwright Test
* **Version Control:** Git & GitHub

## ⚡ Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/ctrl-alt-del-G1tHub/ag-automation.git
cd ag-automation
```

2. **Install dependencies**

```bash
npm install
```

3. **Run tests**

```bash
npx playwright test
```

4. **Open Playwright Test Reporter**

```bash
npx playwright show-report
```

## 📂 Project Structure

```
ag-automation/
├── tests/                # All Playwright test scripts
├── pages/                # Page Object Model files
├── utils/                # Utility/helper functions
├── package.json          # NPM dependencies & scripts
└── README.md             # Project documentation
```

## 🚀 Running Tests

* Run **all tests**:

```bash
npx playwright test
```

* Run a **specific test file**:

```bash
npx playwright test tests/<test-file>.spec.js
```

* Generate **HTML report**:

```bash
npx playwright show-report
```

## 👥 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request and describe your changes.

## 🔒 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.


