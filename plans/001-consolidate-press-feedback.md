Title: Consolidate press feedback across interactive anchors
Plan-Id: 001
Status: DONE
Created-At: 2026-08-07
Git-Commit: 76c706e

## Summary

Make press feedback consistent site-wide by standardizing on the `.pressable` CSS utility (token-aligned) and removing ad-hoc Tailwind duration/transforms from interactive anchors and buttons.

## Scope

Files to change (exact):

- `src/components/project-card.tsx`
- `src/components/NavigationTabs.tsx`
- `src/components/footer.tsx`
- `src/components/header.tsx`
- `src/components/project-listing-*.tsx` (search for other project links)

## Current code excerpts (evidence)

`src/components/project-card.tsx` anchor element (current):

    <a
      href={href}
      className="project-card group relative block aspect-[16/9] w-full overflow-hidden rounded-[45px] border border-willow-grey bg-dough transition-transform duration-300 hover:-translate-y-1"
      aria-label={title ?? "Project"}
    >

## Objective

Replace inline Tailwind motion utilities with a single semantic class: `.pressable` (already defined in `src/app/globals.css`). The `.pressable` class applies:

- `transition: transform var(--duration-quick) var(--ease-smooth-out)`
- `:active { transform: scale(0.97); transition: transform var(--duration-quick) var(--ease-smooth-out) }`
- `prefers-reduced-motion` fallbacks

## Detailed Steps (ordered)

1. Confirm `.pressable` exists in `src/app/globals.css` with the token values. (It is already present in commit `76c706e`.)
2. For each target file, locate the interactive anchor/button and replace ad-hoc Tailwind motion classes with `pressable`.

   Example replacement (exact):
   - Replace this class string (in `project-card.tsx`):

     `project-card group relative block aspect-[16/9] w-full overflow-hidden rounded-[45px] border border-willow-grey bg-dough transition-transform duration-300 hover:-translate-y-1`

   - With this exact class string:

     `project-card group relative block aspect-[16/9] w-full overflow-hidden rounded-[45px] border border-willow-grey bg-dough pressable`

3. Grep the codebase for other anchors with `transition-transform` / `duration-300` / `duration-200` used for motion and update them similarly. Suggested search command for the executor:

   ```bash
   rg "transition-transform|duration-300|duration-200" src/ || true
   ```

4. Run the dev server and smoke-check interactive surfaces listed in the verification section.

Scope boundaries (do not):

- Do not refactor unrelated CSS utilities or Tailwind config.
- Do not change non-interactive decorative animations (e.g., `Rotate` component) in this plan.

## Verification (how to feel-check)

1. On desktop (pointer fine): hover a `ProjectCard` — hover lift should be handled by CSS `project-card` or by `pressable`'s hover rules; pressing (mouse down) should produce a scale-down immediately (<= 150ms).
2. On mobile (touch): tap and hold should show immediate press feedback (scale 0.97) and not delay.
3. Use `prefers-reduced-motion` in devtools to ensure transitions are disabled.

## Rollback

Restore original class strings from the git diff if verification fails.

## Time estimate

~30–90 minutes depending on how many ad-hoc classes are discovered.
