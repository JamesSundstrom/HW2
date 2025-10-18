/**
 * A type representing the two possible statuses of a location
 * in the Tree Game (Status.FIRE or Status.TREE). This type can
 * also be used to represent a single move in the game, e.g.,
 * Status.FIRE represents a move which leaves the current location
 * on fire (either the firefighter not extinguishing a fire, or the
 * pyromaniac setting a fire). */
export class Status {
  onFire: boolean;

  static FIRE = new Status(true);
  static TREE = new Status(false);

  constructor(b: boolean) {
    this.onFire = b;
  }

  opposite(): Status {
    return this.onFire ? Status.TREE : Status.FIRE;
  }

  toString(): string {
    return this.onFire ? "Fire" : "Tree";
  }

  toJSON(): string {
    return this.toString();
  }
}

/**
 * A type to store which characters in an instance of the Tree
 * Game are controlled by a human player. Allows a 0-, 1-, or 2-player
 * game, with either character under human control in the 1-player case. */
export class GameType {
  code: number;

  static ZERO_PLAYER = new GameType(0);
  static FF = new GameType(1);
  static PYRO = new GameType(-1);
  static TWO_PLAYER = new GameType(2);

  constructor(code : number) {
    this.code = code;
  }

  computerFF(): boolean {
    return this == GameType.ZERO_PLAYER || this == GameType.PYRO;
  }

  computerPyro(): boolean {
    return this == GameType.ZERO_PLAYER || this == GameType.FF;
  }

  /** Description of the game type suitable for use on a button. */
  toString(): string {
    switch (this) {
      case GameType.ZERO_PLAYER:
        return "Demonstration mode";
      case GameType.FF:
        return "Play as firefighter";
      case GameType.PYRO:
        return "Play as pyromaniac";
      case GameType.TWO_PLAYER:
        return "Play a 2-player game";
      default:
        throw "Unexpected GameType error";
    }
  }
}

export const FF_NAME = "Firefighter";
export const PYRO_NAME = "Pyromaniac";

/** A class representing the Tree Game. */
export class TreeGame {
  trees: Array<Status>;
  pyroWinnable: boolean;
  location: number;
  winner: string | null;
  pastPositions: Map<string, number>;
  gameType: GameType;
  strategy: Array<string> | null;
  difficulty: number;

  constructor(statusList: Array<Status>, 
      pyroWinnable: boolean = false, 
      gameType: GameType = GameType.TWO_PLAYER, 
      difficulty: number = 10) {
    this.trees = statusList.slice();
    this.pyroWinnable = pyroWinnable;
    this.location = 0;
    this.winner = null;
    this.pastPositions = new Map([[this.position(), 1]]);
    this.gameType = gameType;
    this.strategy = null;
    this.difficulty = difficulty;
    if (this.gameType !== GameType.TWO_PLAYER) this.makeStrategy();
  }

  /**
   * Return a random non-trivial (as defined by the isTrivial() method)
   * TreeGame with n trees, using the specified settings for pyroWinnable
   * (whether the Pyro can win by threefold repetition), gameType (which
   * characters are human-controlled), and difficulty (how well the
   * computer-controlled character plays, if there is at least one).
   *
   * If n < 3, then drop the non-triviality requirement, as every game
   * is essentially trivial.
   */
  static random(n: number, pyroWinnable: boolean, gameType: GameType, difficulty: number = 10) {
    if (n <= 0) {
      throw "Non-positive number of trees provided";
    }
    while (true) {
      let statusList = [];
      for (let i = 0; i < n; i++) {
        const rand = [Status.TREE, Status.FIRE][Math.floor(Math.random() * 2)];
        statusList.push(rand);
      }
      let tg = new TreeGame(statusList, pyroWinnable, gameType, difficulty);
      if (n < 3 || !tg.isTrivial()) {
        return tg;
      }
    }
  }

  toString(): string {
    return this.position();
  }

  count(): number {
    return this.trees.length;
  }

  /** 
   * The current position, as an array of Statuses starting at the
   * current location.
   */
  positionArray(): Array<Status> {
    return [...this.trees.slice(this.location), ...this.trees.slice(0, this.location)];
  }

  /**
   * The position() returned as a string rather than an array, so that 
   * two positions can be compared more easily.
   */
  position(): string {
    return JSON.stringify(this.positionArray());
  }

  /** The Status of the current location. */
  locationStatus(): Status {
    return this.trees[this.location];
  }

  /** Update the game by taking the turn represented by the given move.  */
  takeTurn(move: Status) {
    this.trees[this.location] = move;
    this.location = (this.location + 1) % this.count();
    if (this.winner != null) {return;}
    if (this.isFfWin()) {
      this.winner = FF_NAME;
    } else if (this.pyroWinnable) { // only track positions if needed
      const pos = this.position();
      if (this.pastPositions.has(pos)) {
        this.pastPositions.set(pos, this.pastPositions.get(pos) + 1);
      } else {
        this.pastPositions.set(pos, 1);
      }
      if (this.isPyroWin()) {
        this.winner = PYRO_NAME;
      }
    }
  }

  /** Return true if the firefighter can win before the pyro takes
   * another turn, and false if not.
   */
  isImmediateFirefighterWin() {
    const pos = this.positionArray();
    const firstTree = pos.findIndex((st) => st === Status.TREE);
    if (firstTree === -1) {
      return true;
    }
    return pos.slice(firstTree + 1).every((st) => st === Status.TREE);
  }

  /** Return true if the current position is a trivial win for the firefighter,
   * either because the firefighter can win before the pyromaniac gets a turn,
   * or because every tree but one is on fire.
   */
  isTrivial() {
    const countFires = this.trees.filter((st) => st === Status.FIRE).length;
    return countFires >= this.count() - 1 || this.isImmediateFirefighterWin();
  }

  /** Determine whether the current position is a win for the firefighter,
   * meaning that no tree is on fire.
   *
   * This only checks the current position; it does not check whether the
   * firefighter has already won the game previously.
   */
  isFfWin() {
    return this.trees.every((st) => st === Status.TREE);
  }

  /**
   * Determine whether the current position is a win for the pyromaniac,
   * because win-by-threefold-repetition is active and this is (at least)
   * the third repeat of the current position.
   *
   * This only checks the current position; it does not check whether the
   * pyromaniac has already won the game previously.
   */
  isPyroWin() {
    return this.pyroWinnable && this.pastPositions.get(this.position()) >= 3;
  }

  /** Pre-calculate optimal strategy for game, by storing positions in
   * order from best to worst for firefighter. (This algorithm gives a
   * complete strategy, but proving that fact is non-trivial.)
   * This brute-force method is viable for games with up to ~14 locations.
   * With 13, the strategy calculation starts to introduce a noticeable
   * delay, and faster techniques would probably be desirable. In practice,
   * a game with > 12 locations would be extremely tedious to play, so this
   * is probably a non-issue.
   */
  makeStrategy() {
    let lastPos = Array(this.count()).fill(Status.TREE);
    this.strategy = [JSON.stringify(lastPos)];
    while (this.strategy.length < 2 ** this.count()) {
      const start = lastPos.slice(0, -1);
      const prev = [Status.FIRE, ...start]; // A previous position for lastPos
      const isPrevNew = this.strategy.includes(JSON.stringify(prev));
      const newPos = isPrevNew ? [Status.TREE, ...start] : prev;
      this.strategy.push(JSON.stringify(newPos));
      lastPos = newPos;
    }
  }

  /* Return the best move for the firefighter in the current position. */
  firefighterMove(): Status {
    const rest = [
      ...this.trees.slice(this.location + 1),
      ...this.trees.slice(0, this.location),
    ];
    if (this.strategy === null) {
      this.makeStrategy();
    }
    for (const outcome of this.strategy) {
      switch (outcome) {
        case JSON.stringify([...rest, Status.FIRE]):
          return Status.FIRE;
        case JSON.stringify([...rest, Status.TREE]):
          return Status.TREE;
      }
    }
    throw "Unexpected strategy error";
  }

  /* Return the best move for the pyromaniac in the current position. */
  pyromaniacMove(): Status {
    return this.firefighterMove().opposite();
  }

  /** Return the best move (as a Status) for the player whose turn it is. */
  bestMove() {
    const isFfTurn = this.locationStatus() === Status.FIRE;
    return isFfTurn ? this.firefighterMove() : this.pyromaniacMove();
  }

  /** Return true if it is a computer player's turn, and false if not. */
  isComputerPlayerTurn() {
    if (this.locationStatus() === Status.FIRE)
      return this.gameType.computerFF() && this.winner === null;
    else return this.gameType.computerPyro() && this.winner === null;
  }

  /**
   * Return the computer player's move for the current position, based on the
   * difficulty setting. The value <this.difficulty> specifies the difficulty
   * level of the computer player; higher numbers correspond to higher difficulty,
   * with 10 being perfect play. 0 is intended to be the lowest difficulty,
   * at which the computer's moves are uniformly random, though it is
   * possible to use negative numbers and get worse-than-random play.
   * One exception: if the firefighter can win trivially before the
   * pyromaniac gets a turn, the computer player always gets that right. */
  computerPlayerMove() {
    const p = 0.5 + 0.05 * this.difficulty; // Probability of correct move
    if (this.isImmediateFirefighterWin() || Math.random() <= p) {
      return this.bestMove();
    }
    return this.bestMove().opposite();
  }
}
