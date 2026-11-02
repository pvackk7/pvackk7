import { WORLDS, scheduledWorld, foregroundFor } from "./worlds.js";

const params = new URLSearchParams(location.search);
const selectedWorld = WORLDS.find(world => world.id === params.get("world")) || null;
const dark = params.get("appearance") !== "light";

function matchAppTheme() {
  const world = selectedWorld || scheduledWorld(new Date());
  const palette = dark ? world.dark : world.light;
  document.body.dataset.world = world.id;
  document.documentElement.dataset.world = world.id;
  document.body.classList.toggle("light-appearance", !dark);
  for (const [name, value] of Object.entries(palette)) {
    document.documentElement.style.setProperty("--" + name, value);
  }
  document.documentElement.style.setProperty("--muted", palette.secondary);
  document.documentElement.style.setProperty("--on-accent", foregroundFor(palette.accent));
  document.documentElement.style.setProperty("--scene-glow", dark ? palette.soft : palette.line);
  const label = document.getElementById("landing-world-label");
  if (label) label.textContent = world.name.toUpperCase() + " · LEVEL 01";
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", palette.bg);
}
matchAppTheme();
if (!selectedWorld) setInterval(matchAppTheme, 30000);

