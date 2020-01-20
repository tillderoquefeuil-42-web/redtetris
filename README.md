# redtetris

The aim of this project is to develop a multiplayer tetris game in Full Stack Javascript

## table of contents
* [usage](#usage)
* [the game](#game)
* [project constraints](#constraints)
* [references](#references)

## usage <a id="usage"></a>
Development Mode
```diff
# INSTALL DEPENDENCIES
$ npm install

# LAUNCH SERVER
$ npm run srv-dev
> red_tetrisboilerplate@0.0.1 srv-dev /project/path/redtetris
> DEBUG=tetris:* babel-watch -w src src/server/main.js

# LAUNCH CLIENT
$ npm run client-dev
> red_tetrisboilerplate@0.0.1 client-dev /project/path/redtetris
> webpack-dev-server --colors --hot --inline --host 0.0.0.0 --port 8080

# RUN TEST
$ npm run test
```

Production Mode
```diff
# LAUNCH SERVER
$ npm run srv-dist

# LAUNCH CLIENT
$ npm run client-dist
```

## the game <a id="game"></a>
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

## project constraints <a id="constraints"></a>
- techno
    - Nodejs
    - React
    - Redux
    - socket.io
- back/front
    - start from [boilerplate](https://github.com/redpelicans/red_tetris_boilerplate)
    - index.html and bundle.js are the only files required by the client
    - hash based url (*http://<server_name_or_ip>:<port>/#<room>[<player_name>]*)

## references <a id="references"></a>
About the game :
- [wikipedia - tetris](https://en.wikipedia.org/wiki/Tetris#Game_pieces)
- [interaction-design - tetris](https://www.interaction-design.org/literature/article/a-game-explained-an-example-of-a-single-game-and-how-it-meets-the-rules-of-fun)
- [codeincomplete - javascript tetris](https://codeincomplete.com/posts/javascript-tetris/)

About ReactJS :
- [usehooks - useEventListener](https://usehooks.com/useEventListener/)
- [overreact - setinterval with react hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)

About ReduxJS :
- [daveceddia - what-does-redux-do](https://daveceddia.com/what-does-redux-do/)
- [daveceddia - how-does-redux-work](https://daveceddia.com/how-does-redux-work/)
- [reduxjs - basic-tutorial](https://redux.js.org/basics/basic-tutorial)

Other :
- [itnext - hash based url](https://itnext.io/why-using-hash-based-urls-in-your-react-spa-will-save-you-more-time-than-you-think-a21e2c560879)
