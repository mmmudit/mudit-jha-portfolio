# Link previews

## SmartLinkPreview

Use for product links that need a custom portal preview or compact destination badge. Use `EmailPreviewBadge` for the portfolio email; use a plain `Link`/`a` when preview content adds no decision value. `LinkPreview` is the keyboard-accessible Radix alternative but is not yet used on a product route.

Variants: `card`, `compact`. Nothing else exists—an unlisted variant is a bug, not an option.

- `card` — full OpenGraph or email postcard preview. This is the default.
- `compact` — one-line URL badge with no metadata fetch.

`SmartLinkPreview` renders a positioning `span`, not a link. Its child owns the semantic `a`, `href`, external-link attributes, focus style, and fine-pointer hover classes.

```tsx
// Correct — src/components/footer.tsx
<SmartLinkPreview url={link.href} variant={isEmail ? "card" : "compact"}>
  {link.label}
</SmartLinkPreview>

// Incorrect — tooltip does not exist
<SmartLinkPreview url={link.href} variant="tooltip">{link.label}</SmartLinkPreview>
```

```text
What preview is needed?
├── Email postcard → EmailPreviewBadge
├── Rich URL metadata → SmartLinkPreview variant="card"
├── Destination-only badge → SmartLinkPreview variant="compact"
└── No useful preview → plain Link or anchor
```

Source: `src/components/smart-link-preview.tsx`; product call sites: `src/components/footer.tsx` and `src/components/about-hero-section.tsx`.

## EmailPreviewBadge

Use only for `mailto:hello@muditjha.me`. Other email addresses use a plain `mailto:` anchor or a new explicit component API; do not override the address by styling children.

Variants: none. It delegates to the default `card` variant of `SmartLinkPreview`.

`EmailPreviewBadge` also renders no interactive element. Its child owns the behavior: use a `button` for the existing copy-email flow or an `a` for opening a mail composer. Never use a non-interactive `span` as the only child.

```tsx
// Correct — src/components/about-hero-section.tsx
<EmailPreviewBadge>
  <button type="button" onClick={handleCopyEmail}>Email</button>
</EmailPreviewBadge>

// Incorrect — a span has no email action
<EmailPreviewBadge><span>Email</span></EmailPreviewBadge>
```

Source: `src/components/email-preview-badge.tsx`.

## LinkPreview

Use for an inline, keyboard-accessible Radix hover card when the product explicitly adopts it. Until then, it remains prototype/catalog evidence; production call sites use `SmartLinkPreview` or a plain link.

Variants: none. `href` and `children` are required; fallbacks supply metadata but do not change appearance.

```tsx
// Correct — src/app/prototypes/link-badge/page.tsx
<LinkPreview href="https://cali.so">cali.so</LinkPreview>

// Incorrect — compact belongs to SmartLinkPreview
<LinkPreview href="https://cali.so" variant="compact">cali.so</LinkPreview>
```

Source: `src/components/LinkPreview.tsx`; non-product call sites: `src/app/prototypes/link-badge/page.tsx` and `src/components/system/sections/ComponentSection.tsx`.
