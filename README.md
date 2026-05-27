<video src="public/demo.mp4" autoplay loop muted playsinline width="100%" style="border-radius: 12px; max-width: 720px; display: block; margin: 0 auto;"></video>

[![](public/demo-preview.png)](https://your-site.com/demo.mp4)

# Chess Timer ♟️⏱️

A fast, modern, offline-capable chess timer for physical games. Built with React and TypeScript.

## Features

- 🎯 **Dual Timers** – Independent countdowns for each player
- 📱 **Responsive UI** – Optimized for mobile, tablet, and desktop
- ⚡ **Offline Support** – Fully functional without internet (PWA)
- 🎉 **Game Over Effects** – Confetti and alerts on game end
- 🎛️ **Two UI Variants** – Tilted-halves mobile layout (default) or skeuomorphic device skin
- ⏱️ **Custom Time Controls** – Set game length from 1 min to 60 min
- 🖱️ **Tap-to-Switch** – Easy player switching
- 🧭 **Fullscreen Mode** – Distraction-free timing
- 🎨 **Clean Design** – Modern UI with Tailwind + Shadcn/ui
- 📊 **SEO Optimized** – Fast loading and shareable

## Quick Start

### Live Demo

[View Live App](#) — Try it instantly in your browser.

### Local Setup

```bash
git clone https://github.com/muhammadui/chess-timer.git
cd chess-timer

# install dependencies
pnpm install

# run dev server
pnpm run dev
```

## Usage

1. Select a time control (1–60 minutes)
2. Start the game
3. Tap after your move to switch turns
4. When time runs out, the game ends automatically
5. Use fullscreen for better visibility

## UI Variants

Two playing surfaces ship in the same tree. Both are wired to the same
underlying clock, increment, persistence, wake-lock, sounds, and haptics —
only the look and the tap geometry differ.

| Variant            | Component                            | Best for                                                  |
| ------------------ | ------------------------------------ | --------------------------------------------------------- |
| **Tilted halves** (default) | `src/components/ChessTimer.tsx`             | Phone laid flat between two players. Top half is rotated 180° so the opponent reads their clock right-side-up. |
| **Device skin**    | `src/components/device/DeviceClock.tsx` | Skeuomorphic physical chess-clock — black chassis, ghost-segment LCD, split rocker bar, moulded buttons. Great for streams, demos, or "single phone" use where one person operates both clocks. |

### Switching variants

Edit [`src/pages/Index.tsx`](src/pages/Index.tsx) — it's a two-line change. The variant you don't render is simply not imported, so the bundle stays lean (Vite tree-shakes the unused module).

**Use the tilted-halves layout (current default):**

```tsx
import ChessTimer from "@/components/ChessTimer";

const Index = () => (
  <>
    {/* ...helmet... */}
    <ChessTimer />
  </>
);
```

**Use the device skin:**

```tsx
import DeviceClock from "@/components/device/DeviceClock";

const Index = () => (
  <>
    {/* ...helmet... */}
    <DeviceClock />
  </>
);
```

Save, and `pnpm run dev` (or your next deploy) picks it up. No env vars, no feature flags.

> Both variants persist to the same `localStorage` key, so a game started under one layout survives a flip to the other.

If you want a **runtime toggle** (a switch inside the settings sheet that lets the user pick "Mobile" vs "Device" without redeploying), open an issue or tell the assistant to wire it — it's a small lift.

## Tech Stack

- **React 19 + TypeScript**
- **Tailwind CSS v4**
- **Shadcn/ui** for components
- **Vite** for fast builds
- **Lucide Icons**, **React Confetti**
- **PWA support** via Vite plugin

## PWA Features

- Works offline
- Installable on mobile/desktop
- Cached assets for fast launch
- Responsive across all devices

## Ideal Use Cases

- Club & tournament games
- Casual matches
- Training & speed chess
- Stream overlays

## Contributing

We welcome contributions! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide.

## License

MIT © \[Your Name or Org]

## Acknowledgments

- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide](https://lucide.dev)
- [Shadcn/ui](https://ui.shadcn.com)
