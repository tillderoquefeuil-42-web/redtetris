# redtetris

The aim of this project is to develop a multiplayer tetris game in Full Stack Javascript

## summary
* [the game]()
* [project constraint]()
* [references]()

## the game
1. single player rules
    - goal : \
        Bring down blocks from the top of the screen \
        Your objective is to get all the blocks to fill all the empty space in a line at the bottom of the screen \
        The main goal is to last as long as you can
    - game over (*topping out*) : \
        Your game is over if your pieces reach the top of the screen
    - action : \
        You can only move the pieces in specific ways (rotation by 90°) \
        You can only remove pieces from the screen by filling all the blank space in a line
    - board : \
        10 columns and 20 lines

2. multi players rules
    - each player owns his board
    - if a player removes a line, all others have a blocked line from above in malus
    - you can see every players boards (only the highest block of each column)
    - first player hosts the room (right to restart)

3. tetriminos \
    7 pieces : \
    **⠏ | ⠹ | ⠞ | ⠳ | ⠛ | ⡇ | ⠺**

4. player controls
    - ←/→ : move horizontaly to the left/right
    - ↑ : rotation (90° to the right)
    - ↓ : increase falling speed
    - spacebar : move tetriminos to the bottom instantly

## project constraint
- techno
    - Nodejs
    - React
    - Redux
    - socket.io
- back/front
    - start from [boilerplate](https://github.com/redpelicans/red_tetris_boilerplate)
    - index.html and bundle.js are the only files required by the client
    - hash based url (*http://<server_name_or_ip>:<port>/#<room>[<player_name>]*)

## references
- [wikipedia - tetris](https://en.wikipedia.org/wiki/Tetris#Game_pieces)
- [interaction-design - tetris](https://www.interaction-design.org/literature/article/a-game-explained-an-example-of-a-single-game-and-how-it-meets-the-rules-of-fun)
- [itnext - hash based url](https://itnext.io/why-using-hash-based-urls-in-your-react-spa-will-save-you-more-time-than-you-think-a21e2c560879)

