# Adding your photos, screenshots and videos

Every image on the site already has a slot, shown as a placeholder until you add the file.
To fill a slot:

1. Drop the file into the folder below (use the suggested name, or any name you like).
2. Open the matching content file and set `src` on that item, e.g.
   `src: "/images/projects/genie-a/citizen-01.png"` (paths start at `/`, no `public`).
3. If the real image has a different shape, update `width` and `height` to its pixel size.
4. Run `npm test`: it fails if a `src` points at a file that doesn't exist.

| What | Folder | Suggested names | Content file |
| --- | --- | --- | --- |
| Headshot (square, ≥1200px) | `images/headshot/` | `rifat-headshot.jpg` | `src/content/profile.ts` |
| GenieA citizen app | `images/projects/genie-a/` | `citizen-01.png`, `citizen-02.png` | `src/content/projects.ts` |
| GenieA police app | `images/projects/genie-a/` | `police-01.png` | `src/content/projects.ts` |
| GenieA admin panel (1600×1000) | `images/projects/genie-a/` | `admin-01.png` | `src/content/projects.ts` |
| Health Star screens | `images/projects/health-star/` | `screen-01.png`, `screen-02.png` | `src/content/projects.ts` |
| Star Watch photos | `images/projects/star-watch/` | `drone-01.jpg` | `src/content/projects.ts` |
| Project Altair photos | `images/projects/project-altair/` | `rover-01.jpg`, `team-irc.jpg` | `src/content/projects.ts` |
| Project Aero photos / 3D map | `images/projects/project-aero/` | `drone-01.jpg`, `mapping-3d.png` | `src/content/projects.ts` |

**Phone screenshots:** portrait, around 1080×2340. **Photos:** landscape, around 1600×1000.

## Videos

Put videos in `public/videos/<project>/` (for example `public/videos/project-altair/arm-grasp.mp4`), plus a poster frame:

```ts
{ kind: "video", src: "/videos/project-altair/arm-grasp.mp4", poster: "/videos/project-altair/arm-grasp-poster.jpg", alt: "...", width: 1280, height: 720 }
```

Keep each video under about 8 MB: 720p, H.264, 10–20 seconds, no audio. Videos play muted and only while on screen.
To add another screenshot or photo, copy an existing item in the `screens` or `gallery` list.
