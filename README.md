# AetherBot

![Logo](logo.png)

<p align="center">
  A sophisticated Discord bot for tracking study time and managing user profiles with beautifully generated summary cards.
  <br />
  <a href="#about-the-project"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://github.com/Mohi1038/AetherBot/issues">Report Bug</a>
  ·
  <a href="https://github.com/Mohi1038/AetherBot/issues">Request Feature</a>
</p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#commands">Commands</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About The Project

**AetherBot** is a powerful and intuitive Discord bot designed to enhance server productivity and community engagement. It provides robust tools for users to track their study sessions, view detailed statistics, and customize their public profiles.

The standout feature is its dynamic generation of professional, visually appealing profile and stats cards, offering a modern and personalized user experience.

### Key Features

* **Study Time Tracking:** Monitor and record study hours automatically.
* **Dynamic Card Generation:** Beautifully designed, auto-generated profile and statistics cards.
* **Customizable Profiles:** Users can set a custom "About Me" on their profiles.
* **Modern Slash Commands:** Easy-to-use and intuitive commands powered by Discord's latest API.
* **User-to-User Stats:** View the study statistics of other server members.
* **To-Do List Management:** Add, list, and complete personal tasks with deadlines.
* **Flexible Reminders:** Set up custom reminders for study or any activity, including recurring and one-time reminders.

### Built With

*   [Node.js](https://nodejs.org/)
*   [Discord.js](https://discord.js.org/)
*   [node-canvas](https://github.com/Automattic/node-canvas)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your system.
* **Node.js** (v16.9.0 or higher)
* **npm** (comes with Node.js)
  ```sh
  npm install npm@latest -g
  ```

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Mohi1038/AetherBot.git
    cd AetherBot
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Configure your bot:**
    Create a `config.json` file in the root directory and add your bot's credentials. You can get these from the [Discord Developer Portal](https://discord.com/developers/applications).
    ```json
    {
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "clientId": "YOUR_BOT_CLIENT_ID",
      "guildId": "YOUR_TEST_SERVER_ID"
    }
    ```
4.  **Deploy Slash Commands:**
    Run the deployment script once to register the slash commands with Discord.
    ```sh
    node deploy-commands.js
    ```
5.  **Run the bot:**
    ```sh
    node bot.js
    ```

---

## Deployment

### Deploying to Render

Render is a great platform for hosting Discord bots. Follow these steps to deploy your AetherBot:

1. **Fork/Clone your repository** to GitHub if you haven't already.

2. **Sign up for Render** at [render.com](https://render.com) and connect your GitHub account.

3. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the repository containing your bot

4. **Configure the service:**
   - **Name:** `aetherbot` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node bot.js`

5. **Set Environment Variables:**
   - `DISCORD_TOKEN` - Your Discord bot token
   - `CLIENT_ID` - Your Discord bot client ID
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string
   - `NODE_ENV` - Set to `production`

6. **Deploy Slash Commands:**
   After deployment, run this command locally once to register slash commands:
   ```sh
   npm run deploy-commands
   ```

7. **Your bot will be live!** Render will provide you with a URL where your bot is running.

### Database Setup with Supabase

1. **Create a Supabase Account:**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project

2. **Get Your Database URL:**
   - Go to Settings → Database
   - Copy the connection string (it looks like: `postgresql://postgres.yexyfpxjdqebkeogreck:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`)

3. **Set Up Database Tables:**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create all necessary tables

4. **Environment Variables for Render:**
   ```
   DATABASE_URL=postgresql://postgres.yexyfpxjdqebkeogreck:Mohi@13032006@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   NODE_ENV=production
   CLIENT_ID=1383749755045412925
   ```

### Alternative Database Options

For production, you can also use:
- **PlanetScale** (MySQL-compatible, free tier available)
- **Railway** (PostgreSQL/MySQL)
- **AWS RDS** (MySQL/PostgreSQL)

---

## Usage

Once the bot is running in your server, you can use the following slash commands:

-   To view your profile: `/profile view`
-   To view someone else's profile: `/profile view user:@username`
-   To edit your "About Me": `/profile edit about:Your new bio here`
-   To see your study stats: `/stats`
-   To manage your to-do list: `/todo add task:Read Chapter 5 deadline:2024-06-10`
-   To view your to-do list: `/todo list`
-   To mark a task as complete: `/todo complete`
-   To set up recurring study reminders: `/todo reminders frequency:daily time:18:00`
-   To set a one-time reminder for a user: `/reminder user:@username duration:30m`

---

## Commands

| Command                     | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `/profile view [user]`      | Displays the profile card of you or another user. |
| `/profile edit <about>`     | Updates your "About Me" section.                |
| `/stats [user]`             | Shows the study statistics for you or another user. |
| `/todo add <task> [deadline]`      | Add a new task to your to-do list, with an optional deadline.           |
| `/todo list`                      | List your current to-do tasks.                                          |
| `/todo complete`                  | Mark a selected task as complete.                                       |
| `/todo reminders <frequency> <time>` | Set up recurring study reminders (daily, weekly, monthly) at a specific time. |
| `/reminder <user> <duration>`     | Set a one-time reminder for a user after a specified duration (e.g., 30m, 2h). |
| *... (more things are coming soon)* |                                                 |

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## Contact

**Mohit Meemruath**

[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:mohimeemrauth2023@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Mohi1038)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohit-meemrauth/)
