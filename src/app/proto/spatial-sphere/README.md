# Spatial sphere interaction study

Preview: `/proto/spatial-sphere`. Keys 1–3 choose Immersed, Float, Orbit; R resets the view. The URL retains the chosen mode. Tune interaction exposes live radius, damping, camera duration, and orbit speed; Copy settings exports the values. Sliders update the imperative scene without React renders.

The prototype loads the same published Sanity collection as `/play`, with the same local fallback. Titles, tags, tiers and destinations come from those items. Local images are converted to ≤512px WebP thumbnails; Sanity and Unsplash URLs request WebP at ≤512px. The local intro video uses a captured frame, and notes or videos without a poster use a thumbnail of their existing title. Clicking an item opens the existing ProjectModal with its original media and description. Production Play is unchanged.

`src/components/SpatialSphere.tsx` is mounted only on this isolated route. Production pages have not been changed. Pass the existing Project[] as `projects` to open ProjectModal for a matching id, _id, or slug. Unmatched items navigate to href. An onSelect callback can replace this behavior.

`src/lib/spatialLayout.ts` owns the radius, size tiers, position type and Fibonacci distribution. Replace fibonacciSphere to introduce a spiral. `src/lib/spatialDepth.ts` owns camera-distance mapping and tag matching.

| Mode | Interaction axis | Useful for | Cost |
| --- | --- | --- | --- |
| Immersed | Center looking outward | Exploring spatial relationships | No overview; must rotate to see every item |
| Float | Still exterior with gentle bob | Deliberate browsing | Less ambient discovery |
| Orbit | Slowly rotating exterior | Discovering work without dragging | More movement; pauses on card hover or drag |

Wheel is captured only within the scene surface. Scroll up enters, down exits; pinch spread enters on touch. Enter and the mode buttons provide explicit alternatives. Arrow keys rotate. List view exposes every title as an HTML button. WebGL failure or texture loading failure falls back to the grid. Reduced motion disables inertia, dolly gestures, bob, and auto-rotation; mode selection transitions instantly.

After real-data review and a chosen direction, record selected settings and rejected options, integrate the component in the intended portfolio location, and remove this prototype route.
