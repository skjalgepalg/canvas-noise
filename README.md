# canvas-noise

Playground for drawing noise to canvas with various interactions

## Credits/history

Started as a modification from [mollerse's gist for simplex loops](https://gist.github.com/mollerse/3bcaedb67d463b8d6a6558c3dc634b30)

Used as basis of exploring multithreading as part of [innovasjonsdag-web-workers](https://github.com/nrkno/innovasjonsdag-web-workers)

## Export loop as video

We use ccapture.js to export frames as a webm by setting `CAPTURE=true`.
Then use [ffmpeg](https://ffmpeg.org/) to convert to mp4 with matching framerate to our settings and then looping 3 times to generate a file with

```sh
  ffmpeg -i path-to-exported.webm -r 25 output.mp4
```

To generate a loop:

```sh
  ffmpeg -stream_loop 3 -i output.mp4 -c copy output-loop_x4.mp4
```

## Local setup

### nvm

nvm is used to manage node version. [installation using homebrew](https://formulae.brew.sh/formula/nvm) works ok to install on mac OS, despite [not being supported officially](https://github.com/nvm-sh/nvm?tab=readme-ov-file#important-notes)
To modify node version for the project, update version number in `.nvmrc` and run `nvm install`

### direnv

[direnv](https://direnv.net/) is used to help automate correct node version and keep npm packages up to date

Run `direnv allow` to approve running the content of `.envrc`. NB! document what goes in that file extensively.

## Running locally

Call the `dev` script using npm to start a local web-server running the code. Vite should output a link to the local app, e.g. http://localhost:5173/

```sh
npm run dev
```
