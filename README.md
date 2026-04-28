# Nommia - Family Week Planner

Nommia is a collaborative web application designed to help small households (families) plan their week efficiently. The app provides a centralized platform for families to coordinate meals, tasks, shopping, and contacts.

## Goals

- Simplify weekly planning for busy families
- Enable seamless collaboration between family members
- Reduce mental load associated with household management
- Provide intuitive tools for meal planning, task management, and shopping

## Features

### Implemented
- **Meal Planning**: Plan meals for each day of the week with detailed recipes and scheduling
- **User Authentication**: Secure login and registration using Better Auth
- **Family Plans**: Create and manage family groups with multiple members
- **Dashboard**: Overview of weekly plans and upcoming events

### Planned
- **Task Management**: Assign and track household chores and responsibilities
- **Grocery List Management**: Automatically generate shopping lists from meal plans and manual additions
- **Address Book**: Store and manage family contacts, emergency information, and important details
- **Collaboration Tools**: Real-time updates and notifications for family members

## Technology Stack

- **Framework**: SvelteKit
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **ORM**: Drizzle ORM
- **Validation**: Zod (inferred from schema files)

## How It Works

1. Create a family plan and invite members
2. Plan meals for the week using the meal planner
3. Assign tasks to family members
4. Generate grocery lists based on meal plans
5. Store important contacts and information in the address book
6. Collaborate in real-time with family members

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/nommia.git

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and auth configuration

# Run database migrations
npx drizzle-kit push

# Start the development server
bun run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.