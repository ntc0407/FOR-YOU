# FOR YOU · V7 — 20/10 interactive 3D experience

A single public website link for everyone. Recipients enter their name and choose a wish on the first screen, then explore flowers, lanterns and a personal letter.

## What changed in V7

- **Mobile-first redesign:** a compact expandable bottom sheet by default, large clear 3D exploration area, separate full list of messages when expanded, compact mobile joystick, well-spaced actions and navigation. Mobile swipe looks around the 3D world.
- **Mouse-look on desktop:** move the mouse over the 3D scene to look without holding a button. WASD/arrows move; moving toward screen edges continues gentle horizontal rotation for a complete 360° view. Mouse drag is still supported.
- **Smoother chapters:** the story panel fades/slides as the camera flies to the next area. Scene marker updates are throttled to reduce mobile layout work.
- **Optimized:** lower mobile WebGL pixel ratio; reduced marker clutter; asset URLs carry a version marker to limit stale browser caching.
- All previous recipient naming, personal-letter, greeting-card PNG and common-URL behaviors remain intact.

## Preview locally

Open this folder in VS Code and run **Live Server** on `index.html`. No npm, build, database, or API key is required.

## Publish changes

Copy the **contents of this folder** into the local cloned GitHub project, replacing matching files. **Do not delete its `.git` directory.** Then run:

```bash
git add .
git commit -m "FOR YOU V7 - Mobile redesign and smooth 360 mouse look"
git push origin main
```

Wait for your Vercel production deployment to reach **Ready**. Visit the website in a private browser window on desktop and mobile.

## Controls

- **Desktop:** WASD / arrow keys to move; simply move your mouse over the 3D view to look in any direction; click a flower/lantern marker or use the story list.
- **Mobile:** drag on the 3D view to look; use the lower-left joystick to move; tap **Xem các lời nhắn** to expand the interactive list. Close with **Thu gọn**. The chapter tabs jump to each scene.

## Checks before sharing with recipients

- Test desktop mouse-look after the camera arrives in the scene.
- Test portrait phone layouts, joystick, bottom sheet, chapter navigation and PNG download.
- Test all dialogs can be closed and another name starts a new experience.
- Real-device WebGL/GPU performance must be tested on actual phones and desktops; the automated test environment cannot display GPU WebGL.

## Deploy target

Static site, framework preset **Other**, root directory `./`, no build command or environment variables.
