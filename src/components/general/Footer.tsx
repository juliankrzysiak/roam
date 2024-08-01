export default function Footer() {
  return (
    <footer className="flex items-center justify-between gap-2 bg-emerald-900 p-4 text-sm text-slate-300">
      <h4 className="font-display text-2xl">
        <a href="#">roam</a>
      </h4>
      <div className="flex flex-col items-end gap-4 underline underline-offset-4 md:flex-row">
        <a href="https://github.com/CastillejaCode/roam">Github</a>
        <a href="https://juliankrzysiak.com">© 2024 Julian Krzysiak</a>
      </div>
    </footer>
  );
}
