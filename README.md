# V-Chess

V-Chess is a modern AI-powered chess web app with tactical “superpowers”.

Unlike traditional chess platforms that only let users play standard games, V-Chess adds a gamified AI layer on top of chess. Players can activate limited tactical abilities during the match, manage their Compound V energy, avoid critical mistakes, and experience chess as a cinematic strategy battle.

## Product Idea

Many beginner and intermediate players lose games without understanding what went wrong. V-Chess makes the game more interactive and beginner-friendly by giving players limited AI-powered tools during the match.

Instead of replacing chess skill, the app turns AI assistance into a game mechanic.

## Key Features

- Full chess board with legal move validation
- Click-to-move controls
- Highlighted legal moves
- Play against AI
- Local Duel mode for two players on one screen
- Game status detection:
  - check
  - checkmate
  - stalemate
  - draw
- Battle Log with move history
- LocalStorage save system
- Responsive design for desktop and mobile
- Game Summary after the match
- Animated tactical UI effects

## AI-Powered Abilities

### Inject V — Best Move

Players can spend Compound V energy to receive a recommended move.

This creates a tactical “power-up” experience instead of a traditional hint system.

### Threat Vision

Scans the board and shows which pieces may be under threat.

### Blunder Shield

Automatically detects dangerous moves that may expose important pieces and warns the player before the move is confirmed.

### Compound V Level

Compound V is the energy system of the game.

Each AI ability costs energy:

- Inject V: 35%
- Threat Vision: 20%
- Blunder Shield: 15%

This turns AI assistance into a limited strategic resource.

## Game Modes

### Vs AI

The player controls White and plays against a simple AI opponent.

### Local Duel

Two players can play on the same screen. This mode disables AI assistance to keep the local match fair.

## Monetization Concept

The project includes a V-Pro upgrade prototype.

V-Pro is a future monetization concept that could include:

- More Compound V energy
- Unlimited tactical scans
- Deep post-game analysis
- Custom board skins
- City-based leaderboard
- Advanced AI difficulty levels

This shows how the product could evolve beyond a simple chess game into a scalable platform.

## Why V-Chess Is Different

Most chess platforms focus on either playing or learning.

V-Chess focuses on making chess feel more dynamic, visual, and exciting by combining:

- chess logic
- AI assistance
- game-like power-ups
- resource management
- cinematic interface design

The result is not just a chessboard, but a product concept with engagement, retention, and monetization potential.

## Tech Stack

- Next.js
- TypeScript
- React
- chess.js
- LocalStorage
- CSS animations
- Vercel

Play:
https://v-chess-self.vercel.app/
