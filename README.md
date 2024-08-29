<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/juliankrzysiak/roam">
    <img src="./src/app/icon.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">roam</h3>

  <p align="center">
    A web app for planning out your roadtrips.
    <br />
    <br />
    <a href="https://roam-gamma.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/juliankrzysiak/roam/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/juliankrzysiak/roam/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project
Desktop              |  Mobile
-------------------------|-------------------------
![Desktop Screenshot][desktop-url]  |  ![Mobile Screenshot][mobile-url]

### Built With

* [![Next][Next.js]][Next-url]
* [![Tailwind][Tailwind]][Tailwind-url]
* [![Supabase][Supabase]][Supabase-url]
<br/>


### How It's Made

I developed this web app because while planning roadtrips for myself, I felt that everything on the market didn't have features I wanted, and they were also too complicated / busy in their design. 

With the trend of server components, I felt it was time to push the envelope and implement them into my project using Next.js.

The data for each trip, day, and place is fetched using server components from a Supabase Postgres database. This proved to be a very efficient system for storing and updating user information - auth for each user was also implemented using Supabase. 

Being able to mutate via server actions, which utilize form actions for asynchronous POST requests, along with the ease in fetching data is a great improvement in the React DX and is something I will defintely stick with in the future. 

I used the Google Map API to display a map for the user to pick locations, along with many other associated APIs for general functionality of the app.

And everything is designed using Tailwind, which just allows me to style everything faster with inline classes and a design system from the start.

This being my first Next.js project, I certainly struggled in the beginning, but I was able to learn so much through the several months of creating this app. 

### Optimizations

Replacing data fetching libraries with async functions in server components allowed me to delete unnecessary dependencies and get user data faster. It's also nice not having to expose environment variables on the client.

I replaced one of the Google Map APIs with a Mapbox API, because Google APIs are expensive and their policy against caching is quite extreme, so I wasn't able to cache as much data as I would have liked.

I had accidentally created several server actions that retreived data, which is not recommneded as they are supposed to only be fore POST requests. So I replaced them with route handlers or even refactored them all out together for a more efficient codebase. 

Several times while creating my project I would reorganize the project structure so that everything was easier to follow and develop.


### Learning Outcomes

| The Good                               | The Bad                                              | The Ugly |
|----------------------------------------|------------------------------------------------------|----------|
| Server components are awesome    | Cookie-based Auth was complicated at first |          |
| Learning a new framework was fun |  Database design could have been better from the start                         |        |
| I realize the strength of relational databases                        |                                                      |          |
| Strengthening React skills                       |                                                      |          |
| TypeScript, TypeScript, Typescript                       |                                                      |          |


<!-- GETTING STARTED -->
## Getting Started

If you want to get a local copy running, here ya go. 

### Prerequisites

* pnpm
  ```
  npm install -g pnpm
  ```

### Installation

1. Clone the repo
   ```
   git clone https://github.com/juliankrzysiak/roam.git
   ```
2. Install NPM packages
   ```
   pnpm install 
   ```
3. Run local development server
   ```
   pnpm dev
   ```
 4. Switch out my info for yours

    You need create a .env.local file that includes
* NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
* NEXT_PUBLIC_MAPBOX_API_KEY
* NEXT_PUBLIC_MAP_ID
* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY
* GOOGLE_MAPS_API_KEY
* SUPABASE_URL
* SUPABASE_ANON_KEY
* SUPABASE_SERVICE_KEY
* DATABASE_URL

  So you need to make your own google maps API keys, your own database, and a mapbox key for calculating the distances between places. 

5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin juliankrzysiak/roam
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Julian Krzysiak - jkrzysiak13@gmail.com

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments


<p align="right">(<a href="#readme-top">back to top</a>)</p>

[desktop-url]: https://i.imgur.com/zOaQA5Z.png
[mobile-url]: https://i.imgur.com/fxR0bZx.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Tailwind]: https://img.shields.io/badge/tailwind-0b1121?style=for-the-badge&logo=tailwindcss&logoColor=3abcf7
[Tailwind-url]: https://tailwindcss.com/
[Supabase]: https://img.shields.io/badge/supabase-121212?style=for-the-badge&logo=supabase&logoColor=3ecf8e
[Supabase-url]: https://supabase.com/
