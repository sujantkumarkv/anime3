# <strong> Anime3 </strong> <br> ![anime3 logo](public/logo250.png)

This project is built for fun for the <strong>Web3 X Anime</strong> community.
<br> Upvote ⬆️ your favorite anime here, share it
to your frens, and make your favorites the top rated one!!!
<p> 
PS: <i>May expand to more general content on feedback.</i>
</p>


### Demo:
\
![](anime3-upvote%20demo.gif)

\
Check it out [here](https://anime3-upvote.vercel.app).
#

The project directory is a react app with an additional folder `backend/` containing smart contract logic built using [hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#quick-start), and deployed to [goerli](https://chainlist.org/?testnets=true&search=goerli) testnet.

PS: <i>click the links to get started setting it up.</i>

## Local setup 
<i>In this directory</i>

### `npm start` 

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000).


### `npm run build`

Builds the app for production to the `build` folder.\

<i>In the `backend/` directory</i>

### `npx hardhat run scripts/?`
- you can run `scripts/run.js` OR `scripts/deploy.js` for testing changes in contract locally and deploying it to goerli testnet <i>respectively</i>.

#### We're using [Quicknode](https://www.quicknode.com/docs)'s services here, you can use a service of your choice.
#### <strong>  `hardhat.config.js` contains object values `url` and `accounts` for your own Quicknode's goerli URL & your ethereum account's private key.
#### Use `dotenv` to export the values and be sure to not commit it.
</strong>

<br>

#### PS:

- We're using [gogoanime's API](https://github.com/riimuru/gogoanime-api) endpoints for search data. Shoutout to the builders !!!


- It's all open-source, pick it up, improve, build or suggest/open a PR to make it more fun and expand features.


#
<br>

Copyright: `MIT`


