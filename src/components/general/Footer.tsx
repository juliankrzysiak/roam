export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-12 bg-emerald-950 px-4 py-2 text-sm text-emerald-50">
      <div className="text-center">
        <h4 className="font-display text-4xl">
          <a href="#">roam</a>
        </h4>
        <p className="font-silly text-2xl">Plan your dream road trip today!</p>
      </div>
      <div className="flex w-full justify-between gap-4 underline underline-offset-4 md:flex-row">
        <a href="https://juliankrzysiak.com">© 2025 Julian Krzysiak</a>
        <a href="https://github.com/CastillejaCode/roam">Github</a>
      </div>
    </footer>
  );
}
