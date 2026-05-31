🔄 Slot Swapper
A peer-to-peer real-time scheduling marketplace for seamless time-slot trading.

Slot Swapper is a full-stack web application designed to eliminate the friction of scheduling conflicts. It provides a centralized marketplace where users can list their booked time slots, discover available slots from peers, and request trades—all powered by real-time bidirectional WebSocket communication.


🎯 The Problem It Solves
Scheduling conflicts are inevitable, but resolving them usually involves a painful, decentralized process:

Endless Back-and-Forth: Users rely on group chats, email chains, or Slack threads asking, "Can anyone take my 3:00 PM slot?"

Information Silos: There is no single source of truth to see who is available, who wants to trade, and which slots are currently locked.

Delayed Responses: By the time someone replies to a trade request, the opportunity may have passed, or the slot may have been given to someone else.

Slot Swapper solves this by providing a dedicated, real-time marketplace. It turns decentralized chaos into an organized, first-come-first-serve exchange system where availability is transparent and actions are instantaneous.

✨ Key Features
Public Marketplace: A filtered feed of all swappable slots currently available from other users.

Real-Time Notifications: Powered by WebSockets. Get instantly notified via toast alerts the second a user requests, accepts, or rejects your slot.

Personalized Dashboard: Track your upcoming scheduled events, active marketplace shares, and incoming swap requests in one clean interface.

Secure Authentication: Protected routes and API endpoints ensuring users can only modify their own schedules.

Responsive UI: A sleek, dark-mode-first interface optimized for both desktop and mobile web experiences.

👥 Use Cases & Examples
Slot Swapper is highly adaptable to any environment where time slots are strictly allocated but human flexibility is required.

1. University & Academic Settings
Scenario: A professor assigns mandatory 15-minute presentation slots during midterms. Student A gets Friday at 4:00 PM, but they have a flight home. Student B got Wednesday at 9:00 AM, but they have an overlapping exam.

How it works: Both students list their slots on the Slot Swapper marketplace. Student A sees Student B's Wednesday slot, clicks "Request Swap", and Student B instantly gets a notification and accepts. The database updates their ownership automatically.

2. Shift Workers & Medical Residents
Scenario: A hospital resident is scheduled for an on-call weekend shift but has a family emergency.

How it works: Instead of texting 15 different colleagues individually, the resident posts the shift to the internal Slot Swapper marketplace. Any colleague looking for extra hours can claim it or offer their Tuesday shift in exchange.

3. Interview Scheduling
Scenario: A company is running a massive hiring drive with 50 candidates scheduled over two days. A candidate realizes their assigned technical interview clashes with their current job.

How it works: The candidate logs into the candidate portal (powered by Slot Swapper) and browses the marketplace of other candidates' times. They seamlessly negotiate a trade without HR having to manually coordinate emails between both parties.

🛠️ Tech Stack
Frontend (Client)

Framework: React (via Vite)

Styling: Tailwind CSS / Custom CSS

State Management: React Context API

Routing: React Router DOM

Deployment: Vercel

Backend (Server)

Framework: Python Flask

Database: SQLAlchemy (PostgreSQL/SQLite)

Real-Time: WebSockets (ws://)

Authentication: JWT (JSON Web Tokens)

Deployment: Render


🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.
