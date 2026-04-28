"use client";

import { useEffect, useState } from "react";
import { Chess, Move, Square } from "chess.js";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { io, Socket } from "socket.io-client";

import { pieceSymbols, STORAGE_KEY } from "./constants";
import {
  getBestSimpleMove,
  getGameResult,
  getMissionRating,
  getSquare,
  getStatus,
  isSquareAttackedByBlack,
} from "./helpers";
import type { GameMode, LastMove, PendingMove, SavedGameData } from "./types";

type RecentGame = {
  id: string;
  result: string;
  game_mode: string;
  compound_left: number;
  created_at: string;
};

export function useChessGame() {
  const [fen, setFen] = useState(() => new Chess().fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [message, setMessage] = useState("White to move");
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [threats, setThreats] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [blunderWarning, setBlunderWarning] = useState<string | null>(null);

  const [injectAnimating, setInjectAnimating] = useState(false);
  const [threatScanning, setThreatScanning] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [compoundLevel, setCompoundLevel] = useState(100);
  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [hasLoadedSave, setHasLoadedSave] = useState(false);

  const [showProModal, setShowProModal] = useState(false);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [abilityFlash, setAbilityFlash] = useState<
    "inject" | "threat" | "shield" | null
  >(null);

  const [user, setUser] = useState<User | null>(null);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [hasSavedFinishedGame, setHasSavedFinishedGame] = useState(false);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineRoomCode, setOnlineRoomCode] = useState("");
  const [joinRoomInput, setJoinRoomInput] = useState("");
  const [onlineColor, setOnlineColor] = useState<"w" | "b" | null>(null);
  const [onlineStatus, setOnlineStatus] = useState("Not connected.");

  const game = new Chess(fen);
  const board = game.board();
  const isGameFinished = game.isGameOver();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (!savedData) {
        setHasLoadedSave(true);
        return;
      }

      const parsed = JSON.parse(savedData) as SavedGameData;

      if (parsed.fen) {
        const savedChess = new Chess(parsed.fen);
        setFen(savedChess.fen());
      }

      if (parsed.message) {
        setMessage(parsed.message);
      }

      if (typeof parsed.compoundLevel === "number") {
        setCompoundLevel(parsed.compoundLevel);
      }

      if (parsed.gameMode === "ai" || parsed.gameMode === "local") {
        setGameMode(parsed.gameMode);
      }

      if (Array.isArray(parsed.moveHistory)) {
        setMoveHistory(parsed.moveHistory);
      }

      setHasLoadedSave(true);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setHasLoadedSave(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedSave) return;

    const saveData: SavedGameData = {
      fen,
      message,
      compoundLevel,
      gameMode,
      moveHistory,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  }, [fen, message, compoundLevel, gameMode, moveHistory, hasLoadedSave]);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);

      if (session?.user) {
        await loadRecentGames(session.user.id);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        loadRecentGames(session.user.id);
      } else {
        setRecentGames([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!isGameFinished) return;

    saveFinishedGame(new Chess(fen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, user, isGameFinished]);

  async function signInWithGithub() {
    setAuthMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setAuthMessage(error.message);
    }
  }

  useEffect(() => {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  if (!socketUrl) {
    setOnlineStatus("Socket URL is missing.");
    return;
  }

  const newSocket = io(socketUrl, {
    transports: ["websocket"],
  });

  setSocket(newSocket);

  newSocket.on("connect", () => {
    setOnlineStatus("Connected to multiplayer server.");
  });

  newSocket.on("disconnect", () => {
    setOnlineStatus("Disconnected from multiplayer server.");
  });

  newSocket.on("room-created", ({ roomCode, color }) => {
    setOnlineRoomCode(roomCode);
    setOnlineColor(color);
    setGameMode("online");
    setMessage("Online Duel: You are White. Waiting for opponent...");
    setOnlineStatus(`Room created: ${roomCode}`);
  });

  newSocket.on("room-joined", ({ roomCode, color, fen, moves }) => {
    setOnlineRoomCode(roomCode);
    setOnlineColor(color);
    setGameMode("online");

    if (fen) {
      setFen(fen);
    }

    if (Array.isArray(moves)) {
      setMoveHistory(moves);
    }

    setMessage("Online Duel: You are Black.");
    setOnlineStatus(`Joined room: ${roomCode}`);
  });

  newSocket.on("player-joined", () => {
    setOnlineStatus("Opponent joined. Online Duel started.");
    setMessage("Online Duel started. White to move.");
  });

  newSocket.on("receive-move", ({ fen, move }) => {
    setFen(fen);

    if (move?.san) {
      setMoveHistory((history) => [...history, move.san]);
      setMessage(`Opponent played ${move.san}. ${getStatus(new Chess(fen))}`);
    } else {
      setMessage(getStatus(new Chess(fen)));
    }

    setSelectedSquare(null);
    setLegalMoves([]);
    setPendingMove(null);
    setBlunderWarning(null);
    setAiHint(null);
    setThreats([]);
  });

  newSocket.on("room-error", (errorMessage) => {
    setOnlineStatus(errorMessage);
  });

  newSocket.on("opponent-disconnected", () => {
    setOnlineStatus("Opponent disconnected.");
  });

  return () => {
    newSocket.disconnect();
  };
}, []);



  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setUser(null);
    setRecentGames([]);
    setAuthMessage("Signed out.");
  }

  async function loadRecentGames(userId: string) {
    const { data, error } = await supabase
      .from("games")
      .select("id, result, game_mode, compound_left, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setRecentGames(data ?? []);
  }

  async function saveFinishedGame(chessGame: Chess) {
    if (!user) return;
    if (!chessGame.isGameOver()) return;
    if (hasSavedFinishedGame) return;

    const result = getGameResult(chessGame);
    const pgn = chessGame.pgn();

    const { error } = await supabase.from("games").insert({
      user_id: user.id,
      result,
      pgn,
      game_mode: gameMode,
      compound_left: compoundLevel,
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setHasSavedFinishedGame(true);
    setAuthMessage("Mission saved to Supabase.");
    await loadRecentGames(user.id);
  }

  function clearSelection() {
    setSelectedSquare(null);
    setLegalMoves([]);
  }

  function triggerAbilityFlash(type: "inject" | "threat" | "shield") {
    setAbilityFlash(type);
    setTimeout(() => setAbilityFlash(null), 700);
  }

  function spendCompound(amount: number) {
    if (compoundLevel < amount) {
      return false;
    }

    setCompoundLevel((level) => Math.max(0, level - amount));
    return true;
  }

  function detectBlunderAfterMove(chess: Chess) {
    const importantPieces = ["q", "r"];
    const boardData = chess.board();

    for (let rowIndex = 0; rowIndex < boardData.length; rowIndex++) {
      for (let colIndex = 0; colIndex < boardData[rowIndex].length; colIndex++) {
        const square = getSquare(rowIndex, colIndex);
        const piece = chess.get(square);

        if (!piece) continue;

        const isWhiteImportantPiece =
          piece.color === "w" && importantPieces.includes(piece.type);

        if (!isWhiteImportantPiece) continue;

        const isUnderAttack = isSquareAttackedByBlack(chess, square);

        if (isUnderAttack) {
          const pieceName = piece.type === "q" ? "queen" : "rook";

          return `Blunder Shield detected danger: after this move, your ${pieceName} on ${square} can be attacked.`;
        }
      }
    }

    return null;
  }

  function makeAiMove(chessAfterUserMove: Chess) {
    if (chessAfterUserMove.isGameOver()) return;

    setAiThinking(true);

    setTimeout(() => {
      const aiChess = new Chess(chessAfterUserMove.fen());
      const aiMove = getBestSimpleMove(aiChess);

      if (!aiMove) {
        setAiThinking(false);
        return;
      }

      aiChess.move(aiMove);

      setFen(aiChess.fen());
      setLastMove({
        from: aiMove.from as Square,
        to: aiMove.to as Square,
      });
      setMoveHistory((history) => [...history, aiMove.san]);

      setMessage(
        aiChess.isGameOver()
          ? `Mission complete. AI played ${aiMove.san}. ${getStatus(aiChess)}`
          : `AI played ${aiMove.san}. ${getStatus(aiChess)}`
      );

      setAiHint(null);
      setThreats([]);
      setLegalMoves([]);
      setSelectedSquare(null);
      setPendingMove(null);
      setBlunderWarning(null);
      setAiThinking(false);
    }, 650);
  }

  function commitUserMove(from: Square, to: Square) {
    const chess = new Chess(fen);

    try {
      const move = chess.move({
        from,
        to,
        promotion: "q",
      });

      if (!move) {
        setMessage(`Illegal move: ${from} to ${to}.`);
        clearSelection();
        return;
      }

      setFen(chess.fen());
      setLastMove({ from, to });
      setMoveHistory((history) => [...history, move.san]);

      clearSelection();
      setAiHint(null);
      setThreats([]);
      setPendingMove(null);
      setBlunderWarning(null);

      if (chess.isGameOver()) {
        setMessage(`Mission complete. ${getStatus(chess)}`);
        return;
      }

      if (gameMode === "ai") {
  setMessage(`You played ${move.san}. AI is thinking...`);
  makeAiMove(chess);
} else if (gameMode === "online") {
  setMessage(`You played ${move.san}. Waiting for opponent...`);

  if (socket && onlineRoomCode) {
    socket.emit("send-move", {
      roomCode: onlineRoomCode,
      fen: chess.fen(),
      move: {
        san: move.san,
        from: move.from,
        to: move.to,
      },
    });
  }
} else {
  setMessage(getStatus(chess));
}
    } catch {
      setMessage(`Illegal move: ${from} to ${to}.`);
      clearSelection();
      setPendingMove(null);
      setBlunderWarning(null);
    }
  }

  function handleSquareClick(square: Square) {
    const chess = new Chess(fen);

    if (chess.isGameOver()) {
      setMessage(getStatus(chess));
      return;
    }

    if (gameMode === "ai" && chess.turn() !== "w") {
      setMessage("It is AI's turn. Please wait.");
      return;
    }

    if (gameMode === "online") {
  if (!onlineRoomCode || !onlineColor) {
    setMessage("Create or join an online room first.");
    return;
  }

  if (chess.turn() !== onlineColor) {
    setMessage("Wait for your opponent's move.");
    return;
  }
}

    const piece = chess.get(square);

    if (!selectedSquare) {
      if (!piece) {
        setMessage("Select a piece first.");
        return;
      }

      if (gameMode === "ai" && piece.color !== "w") {
        setMessage("You are playing white. Select a white piece.");
        return;
      }

      if (gameMode === "local" && piece.color !== chess.turn()) {
        setMessage(chess.turn() === "w" ? "White to move." : "Black to move.");
        return;
      }

      if (gameMode === "online" && piece.color !== onlineColor) {
  setMessage(
    onlineColor === "w"
      ? "You are playing White."
      : "You are playing Black."
  );
  return;
}

      const moves = chess.moves({
        square,
        verbose: true,
      }) as Move[];

      setSelectedSquare(square);
      setLegalMoves(moves.map((move) => move.to as Square));
      setMessage(`Selected ${square}. Choose a highlighted square.`);
      return;
    }

    if (selectedSquare === square) {
      clearSelection();
      setPendingMove(null);
      setBlunderWarning(null);
      setMessage("Selection cancelled.");
      return;
    }

    if (
  piece &&
  ((gameMode === "ai" && piece.color === "w") ||
    (gameMode === "local" && piece.color === chess.turn()) ||
    (gameMode === "online" &&
      piece.color === onlineColor &&
      piece.color === chess.turn()))
) {
      const moves = chess.moves({
        square,
        verbose: true,
      }) as Move[];

      setSelectedSquare(square);
      setLegalMoves(moves.map((move) => move.to as Square));
      setPendingMove(null);
      setBlunderWarning(null);
      setMessage(`Selected ${square}. Choose a highlighted square.`);
      return;
    }

    const possibleMoves = chess.moves({
      square: selectedSquare,
      verbose: true,
    }) as Move[];

    const selectedMove = possibleMoves.find((move) => move.to === square);

    if (!selectedMove) {
      setMessage(`Illegal move: ${selectedSquare} to ${square}.`);
      clearSelection();
      setPendingMove(null);
      setBlunderWarning(null);
      return;
    }

    try {
      const testChess = new Chess(fen);

      const testMove = testChess.move({
        from: selectedSquare,
        to: square,
        promotion: "q",
      });

      if (!testMove) {
        setMessage(`Illegal move: ${selectedSquare} to ${square}.`);
        clearSelection();
        return;
      }

      const isSamePendingMove =
        pendingMove?.from === selectedSquare && pendingMove?.to === square;

      const warning =
        gameMode === "ai" ? detectBlunderAfterMove(testChess) : null;

      if (warning && !isSamePendingMove) {
        if (compoundLevel >= 15) {
          setCompoundLevel((level) => Math.max(0, level - 15));
          triggerAbilityFlash("shield");

          setPendingMove({
            from: selectedSquare,
            to: square,
          });

          setBlunderWarning(warning);
          setMessage(
            "Blunder Shield activated. Dangerous move detected. Click the same target square again to confirm."
          );
          return;
        }

        setBlunderWarning(
          "Blunder Shield detected danger, but Compound V level is too low to block the move."
        );
      }

      commitUserMove(selectedSquare, square);
    } catch {
      setMessage(`Illegal move: ${selectedSquare} to ${square}.`);
      clearSelection();
      setPendingMove(null);
      setBlunderWarning(null);
    }
  }

  function resetGame() {
    const chess = new Chess();

    setFen(chess.fen());
    clearSelection();
    setMessage(gameMode === "ai" ? "White to move" : "Local Duel: White to move");
    setAiHint(null);
    setThreats([]);
    setPendingMove(null);
    setBlunderWarning(null);
    setInjectAnimating(false);
    setThreatScanning(false);
    setAiThinking(false);
    setCompoundLevel(100);
    setLastMove(null);
    setAbilityFlash(null);
    setMoveHistory([]);
    setHasSavedFinishedGame(false);
  }

  function changeGameMode(mode: GameMode) {
    const chess = new Chess();

    setGameMode(mode);
    setFen(chess.fen());
    clearSelection();
    setAiHint(null);
    setThreats([]);
    setPendingMove(null);
    setBlunderWarning(null);
    setInjectAnimating(false);
    setThreatScanning(false);
    setAiThinking(false);
    setCompoundLevel(100);
    setLastMove(null);
    setAbilityFlash(null);
    setMoveHistory([]);
    setHasSavedFinishedGame(false);
    setOnlineRoomCode("");
setJoinRoomInput("");
setOnlineColor(null);
setOnlineStatus(
  mode === "online"
    ? "Create or join a room to start Online Duel."
    : "Not connected."
);

    localStorage.removeItem(STORAGE_KEY);

    setMessage(
  mode === "ai"
    ? "White to move"
    : mode === "local"
    ? "Local Duel: White to move"
    : "Online Duel: create or join a room."
);
  }

  function injectV() {
    const chess = new Chess(fen);

    if (gameMode === "local") {
      setAiHint("Inject V is disabled in Local Duel mode.");
      return;
    }

    if (chess.isGameOver()) {
      setAiHint("The game is already over.");
      return;
    }

    if (chess.turn() !== "w") {
      setAiHint("AI is moving now. Hint is only available on your turn.");
      return;
    }

    const canSpend = spendCompound(35);

    if (!canSpend) {
      setAiHint("Not enough Compound V. Restart the mission to restore energy.");
      return;
    }

    triggerAbilityFlash("inject");
    setInjectAnimating(true);
    setTimeout(() => setInjectAnimating(false), 750);

    const bestMove = getBestSimpleMove(chess);

    if (!bestMove) {
      setAiHint("No available moves.");
      return;
    }

    setAiHint(
      `COMPOUND V INJECTED: ${bestMove.san}. This move looks strong because it creates pressure, wins material, or improves your position.`
    );
  }

  function threatVision() {
    if (gameMode === "local") {
      setThreats(["Threat Vision is disabled in Local Duel mode."]);
      return;
    }

    const canSpend = spendCompound(20);

    if (!canSpend) {
      setThreats(["Not enough Compound V. Restart the mission to restore energy."]);
      return;
    }

    triggerAbilityFlash("threat");
    setThreatScanning(true);
    setThreats(["SCANNING BOARD..."]);

    setTimeout(() => {
      const chess = new Chess(fen);

      if (chess.isGameOver()) {
        setThreats(["The game is already over."]);
        setThreatScanning(false);
        return;
      }

      const boardData = chess.board();
      const foundThreats: string[] = [];

      for (let rowIndex = 0; rowIndex < boardData.length; rowIndex++) {
        for (let colIndex = 0; colIndex < boardData[rowIndex].length; colIndex++) {
          const square = getSquare(rowIndex, colIndex);
          const piece = chess.get(square);

          if (!piece || piece.color !== "w") continue;

          const canBeCaptured = isSquareAttackedByBlack(chess, square);

          if (canBeCaptured) {
            foundThreats.push(
              `${pieceSymbols[`${piece.color}${piece.type}`]} on ${square} is under threat.`
            );
          }
        }
      }

      if (foundThreats.length === 0) {
        setThreats(["Threat Vision: no direct threats to your pieces found."]);
      } else {
        setThreats(foundThreats);
      }

      setThreatScanning(false);
    }, 650);
  }

  function createOnlineRoom() {
  if (!socket) {
    setOnlineStatus("Socket is not connected.");
    return;
  }

  resetGame();
  socket.emit("create-room");
}

function joinOnlineRoom() {
  if (!socket) {
    setOnlineStatus("Socket is not connected.");
    return;
  }

  const code = joinRoomInput.trim().toUpperCase();

  if (!code) {
    setOnlineStatus("Enter a room code first.");
    return;
  }

  resetGame();
  socket.emit("join-room", {
    roomCode: code,
  });
}

  return {
    fen,
    game,
    board,
    selectedSquare,
    legalMoves,
    message,
    aiHint,
    threats,
    blunderWarning,
    injectAnimating,
    threatScanning,
    aiThinking,
    compoundLevel,
    showProModal,
    setShowProModal,
    gameMode,
    lastMove,
    showIntro,
    setShowIntro,
    abilityFlash,
    moveHistory,
    isGameFinished,
    handleSquareClick,
    resetGame,
    changeGameMode,
    injectV,
    threatVision,

    user,
    recentGames,
    authMessage,
    signInWithGithub,
    signOut,

    getGameResult: () => getGameResult(game),
    getMissionRating: () =>
      getMissionRating(game, moveHistory.length, compoundLevel),
    onlineRoomCode,
joinRoomInput,
setJoinRoomInput,
onlineColor,
onlineStatus,
createOnlineRoom,
joinOnlineRoom,
  };
}
